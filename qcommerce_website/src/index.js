import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@ecommerce/customer-app',
  app: () => System.import('@ecommerce/customer-app'),
  activeWhen: ['/'],
  });

registerApplication(
  {
    name: '@ecommerce/store-app',
    app: () => System.import('@ecommerce/store-app'),
    activeWhen: (location) => location.pathname.startsWith('/store'),
  }
);

start({
  urlRerouteOnly: true,
});
