# Conjugare cards API

A server for [Cărți cu conjugare](https://github.com/lastmarsch/conjugare-cards).

## Dexonline
The app uses the data from [dexonline.ro](https://dexonline.ro/). 

## Routes
- `conjugare/:verb`
  
  Returns a JSON object.
  
  ```ts
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
  ```
