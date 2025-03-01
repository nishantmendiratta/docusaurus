/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import {
  loadContext,
  loadPluginConfigs,
  type LoadContextOptions,
} from '../../index';
import initPlugins from '../init';
import {sortConfig} from '../index';
import type {RouteConfig} from '@docusaurus/types';

describe('initPlugins', () => {
  async function loadSite(options: LoadContextOptions = {}) {
    const siteDir = path.join(__dirname, '__fixtures__', 'site-with-plugin');
    const context = await loadContext(siteDir, options);
    const pluginConfigs = await loadPluginConfigs(context);
    const plugins = await initPlugins({
      pluginConfigs,
      context,
    });

    return {siteDir, context, plugins};
  }

  test('plugins gets parsed correctly and loads in correct order', async () => {
    const {context, plugins} = await loadSite();
    expect(context.siteConfig.plugins?.length).toBe(4);
    expect(plugins.length).toBe(8);

    expect(plugins[0].name).toBe('preset-plugin1');
    expect(plugins[1].name).toBe('preset-plugin2');
    expect(plugins[2].name).toBe('preset-theme1');
    expect(plugins[3].name).toBe('preset-theme2');
    expect(plugins[4].name).toBe('first-plugin');
    expect(plugins[5].name).toBe('second-plugin');
    expect(plugins[6].name).toBe('third-plugin');
    expect(plugins[7].name).toBe('fourth-plugin');
    expect(context.siteConfig.themeConfig).toEqual({a: 1});
  });

  test('plugins with bad values throw user-friendly error message', async () => {
    await expect(() =>
      loadSite({
        customConfigFilePath: 'badPlugins.docusaurus.config.js',
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe('sortConfig', () => {
  test('should sort route config correctly', () => {
    const routes: RouteConfig[] = [
      {
        path: '/',
        component: '',
        routes: [
          {path: '/someDoc', component: ''},
          {path: '/someOtherDoc', component: ''},
        ],
      },
      {
        path: '/',
        component: '',
      },
      {
        path: '/',
        component: '',
        routes: [{path: '/subroute', component: ''}],
      },
      {
        path: '/docs',
        component: '',
        routes: [
          {path: '/docs/someDoc', component: ''},
          {path: '/docs/someOtherDoc', component: ''},
        ],
      },
      {
        path: '/community',
        component: '',
      },
      {
        path: '/some-page',
        component: '',
      },
    ];

    sortConfig(routes);

    expect(routes).toMatchSnapshot();
  });

  test('should sort route config given a baseURL', () => {
    const baseURL = '/latest';
    const routes: RouteConfig[] = [
      {
        path: baseURL,
        component: '',
        routes: [
          {path: `${baseURL}/someDoc`, component: ''},
          {path: `${baseURL}/someOtherDoc`, component: ''},
        ],
      },
      {
        path: `${baseURL}/example`,
        component: '',
      },
      {
        path: `${baseURL}/docs`,
        component: '',
        routes: [
          {path: `${baseURL}/docs/someDoc`, component: ''},
          {path: `${baseURL}/docs/someOtherDoc`, component: ''},
        ],
      },
      {
        path: `${baseURL}/community`,
        component: '',
      },
      {
        path: `${baseURL}/some-page`,
        component: '',
      },
    ];

    sortConfig(routes, baseURL);

    expect(routes).toMatchSnapshot();
  });
});
