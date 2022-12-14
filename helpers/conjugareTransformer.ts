import HTMLParser from 'node-html-parser';
import { ServerError } from './Error';

interface Conjugare {
  verb: string;
  grupa: string;
  conjugarea: string;
  infinitivLung: string;
  participiu: string;
  gerunziu: string;
  imperativ: {
    sg: string;
    pl: string;
  };
  prezent: string[];
  conjunctivPrezent: string[];
  imperfect: string[];
  perfectSimplu: string[];
  maiMultCaPerfect: string[];
}

export const conjugareTransformer = (html: string) => {
  const conjugareObject: Conjugare = {
    verb: '—',
    grupa: '—',
    conjugarea: '—',
    infinitivLung: '—',
    participiu: '—',
    gerunziu: '—',
    imperativ: {
      sg: '—',
      pl: '—',
    },
    prezent: [],
    conjunctivPrezent: [],
    imperfect: [],
    perfectSimplu: [],
    maiMultCaPerfect: [],
  };

  const paradigms = HTMLParser.parse(html, {
    lowerCaseTagName: true,
    comment: false,
    blockTextElements: {
      script: false,
      noscript: false,
      style: false,
      pre: false,
    },
  }).querySelectorAll('.paraLexeme');

  if (!paradigms) {
    throw new ServerError({ status: 404, message: 'Verb card not found' });
  }

  for (const paradigm of paradigms) {
    const tags = paradigm.querySelectorAll('.tag');

    if (!tags || tags.length === 0 || tags[0].innerText !== 'verb') {
      continue;
    }

    conjugareObject.grupa = tags[1].innerText || '—';
    conjugareObject.conjugarea = tags[2].innerText || '—';

    const tableRows = paradigm.querySelectorAll('tr');

    try {
      const headerCells = tableRows[1].querySelectorAll('td ul');
      conjugareObject.verb =
        `a ${headerCells[0]?.querySelector('li')?.innerText}` || '—';
      conjugareObject.infinitivLung =
        headerCells[1]?.querySelector('li')?.innerHTML || '—';
      conjugareObject.participiu =
        headerCells[2]?.querySelector('li')?.innerHTML || '—';
      conjugareObject.gerunziu =
        headerCells[3]?.querySelector('li')?.innerHTML || '—';
    } catch (e) {
      console.warn(e);
    }

    try {
      const imperativCells = tableRows[2].querySelectorAll('td ul');
      conjugareObject.imperativ.sg =
        imperativCells[0].querySelector('li')?.innerHTML || '—';
      conjugareObject.imperativ.pl = imperativCells[1]
        .querySelectorAll('li')
        ?.map((word) => word.innerHTML || '—')
        .join(', ');
    } catch (e) {
      console.warn(e);
    }

    const conjugareArray = [
      conjugareObject.prezent,
      conjugareObject.conjunctivPrezent,
      conjugareObject.imperfect,
      conjugareObject.perfectSimplu,
      conjugareObject.maiMultCaPerfect,
    ];

    for (let i = 5; i < tableRows.length; i++) {
      try {
        const cells = tableRows[i].querySelectorAll('td ul');
        for (let j = 0; j < conjugareArray.length; j++) {
          const innerHTML = cells[j]?.querySelector('li')?.innerHTML || '—';

          conjugareArray[j].push(
            j === 1 && innerHTML !== '—' ? `(să) ${innerHTML}` : innerHTML,
          );
        }
      } catch (e) {
        console.warn(e);
      }
    }

    return conjugareObject;
  }

  throw new ServerError({ status: 404, message: 'Verb not found' });
};
