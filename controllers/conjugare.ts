import axios from 'axios';
import express from 'express';
import { conjugareTransformer } from '../helpers/conjugareTransformer';
import { ServerError } from '../helpers/Error';

const DEXONLINE_DEFINITIE_URL = `https://dexonline.ro/definitie`;

const conjugareRouter = express.Router({
  mergeParams: true,
});

conjugareRouter.get('/:verb', (req, res) => {
  const { verb } = req.params;

  axios
    .get(`${DEXONLINE_DEFINITIE_URL}/${verb}/paradigma`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then((response) => {
      const { data } = response;
      const conjugare = conjugareTransformer(data);

      if (Object.keys(conjugare).length === 0) {
        throw new ServerError({ status: 404, message: 'Not found!' });
      }

      res.json(conjugare);
    })
    .catch((e) => {
      const isServerError = e instanceof ServerError;
      if (!isServerError) {
        e = new ServerError({ status: e.response.status, message: e.response.statusText });
      }
      res.status(e.status).send(e.message);
    });
});

export { conjugareRouter };
