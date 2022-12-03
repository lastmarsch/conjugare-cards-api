import HTMLParser from 'node-html-parser';

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
    verb: '',
    grupa: '',
    conjugarea: '',
    infinitivLung: '',
    participiu: '',
    gerunziu: '',
    imperativ: {
      sg: '',
      pl: '',
    },
    prezent: [],
    conjunctivPrezent: [],
    imperfect: [],
    perfectSimplu: [],
    maiMultCaPerfect: [],
  };

  const root = HTMLParser.parse(html, {
    lowerCaseTagName: true,
    comment: false,
    blockTextElements: {
      script: false,
      noscript: false,
      style: false,
      pre: false,
    },
  }).querySelector('html body');

  const paradigms = root?.querySelectorAll('.paradigmDiv .paraLexeme') || [];

  for (const paradigm of paradigms) {
    const tags = paradigm.querySelectorAll('.tag');
    if (tags[0].innerText !== 'verb') continue;

    conjugareObject.grupa = tags[1].innerText || '';
    conjugareObject.conjugarea = tags[2].innerText || '';

    const tableRows = paradigm.querySelectorAll('tr');

    const headerCells = tableRows[1].querySelectorAll('td ul');
    conjugareObject.verb = `a ${headerCells[0]?.querySelector('li')?.innerText}` || '';
    conjugareObject.infinitivLung = headerCells[1]?.querySelector('li')?.innerHTML || '';
    conjugareObject.participiu = headerCells[2]?.querySelector('li')?.innerHTML || '';
    conjugareObject.gerunziu = headerCells[3]?.querySelector('li')?.innerHTML || '';

    const imperativCells = tableRows[2].querySelectorAll('td ul');
    conjugareObject.imperativ.sg = imperativCells[0].querySelector('li')?.innerHTML || '';
    conjugareObject.imperativ.pl = imperativCells[1]
      .querySelectorAll('li')
      ?.map((word) => word.innerHTML || '')
      .join(', ');

    const conjugareArray = [
      conjugareObject.prezent,
      conjugareObject.conjunctivPrezent,
      conjugareObject.imperfect,
      conjugareObject.perfectSimplu,
      conjugareObject.maiMultCaPerfect,
    ];

    for (let i = 5; i < tableRows.length; i++) {
      const cells = tableRows[i].querySelectorAll('td ul');

      for (let j = 0; j < conjugareArray.length; j++) {
        const innerHTML = cells[j]?.querySelector('li')?.innerHTML || '';

        conjugareArray[j].push(j === 1 ? `(să) ${innerHTML}` : innerHTML);
      }
    }

    return conjugareObject;
  }

  return {};
};
