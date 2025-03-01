/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validate} from 'webpack';

import createServerConfig from '../server';
import loadSetup from '../../server/__tests__/testUtils';

describe('webpack production config', () => {
  test('simple', async () => {
    console.log = jest.fn();
    const props = await loadSetup('simple');
    const config = await createServerConfig({props});
    const errors = validate(config);
    expect(errors).toBeUndefined();
  });

  test('custom', async () => {
    console.log = jest.fn();
    const props = await loadSetup('custom');
    const config = await createServerConfig({props});
    const errors = validate(config);
    expect(errors).toBeUndefined();
  });
});
