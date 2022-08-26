import { check, group } from 'k6';
import http from 'k6/http';
import { Options } from 'k6/options';

import { getSummaryHandler } from './utils';

const apiType = 'notification';

export const options: Options = {
  scenarios: {
    ramping_vus: {
      // name of the executor to use
      executor: 'ramping-vus',

      startVUs: 0,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '10s', target: 20 },
        { duration: '10s', target: 30 },
        { duration: '10s', target: 40 },
        { duration: '10s', target: 50 },
        { duration: '10s', target: 40 },
        { duration: '10s', target: 30 },
        { duration: '10s', target: 20 },
        { duration: '10s', target: 10 },
        { duration: '10s', target: 0 },
      ],

      gracefulRampDown: '0s',
      // common scenario configuration
      startTime: '0s',
      gracefulStop: '5s',
      env: { EXAMPLEVAR: 'testing' },
      tags: { example_tag: 'testing' },
    },
    burst_vus: {
      // name of the executor to use
      executor: 'shared-iterations',

      // common scenario configuration
      startTime: '120s',
      gracefulStop: '5s',
      env: { EXAMPLEVAR: 'testing' },
      tags: { example_tag: 'testing' },

      // executor-specific configuration
      vus: 100,
      iterations: 100,
      maxDuration: '30s',
    },
  },
};

export default function () {
  group(`${apiType}: visit notification base api`, function () {
    const res = http.get(
      'https://us-central1-myapp-temp-dev.cloudfunctions.net/notification'
    );
    check(res, {
      'status is 200': () => res.status === 200,
    });
  });

  group(`${apiType}: visit notification success api`, function () {
    const res = http.get(
      'https://us-central1-myapp-temp-dev.cloudfunctions.net/notification/success'
    );
    check(res, {
      'status is 200': () => res.status === 200,
    });
  });

  group(`${apiType}: visit notification failure api`, function () {
    const res = http.get(
      'https://us-central1-myapp-temp-dev.cloudfunctions.net/notification/failure'
    );
    check(res, {
      'status is 500': () => res.status === 500,
    });
  });
}

export function handleSummary(data) {
  return getSummaryHandler(apiType, data);
}
