import { AppConfigV1 } from '../../appConfig/v1/appConfig';
import { AppConfigV2 } from '../../appConfig/v2/appConfig';

export interface ProductConfigV1 {
  version: string;
  appConfig: AppConfigV1 | AppConfigV2;
}
