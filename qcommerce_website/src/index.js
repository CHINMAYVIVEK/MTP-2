import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@ecommerce/customer-app',
  app: () => System.import('@ecommerce/customer-app'),
  activeWhen: (location) => {
    const isStore = location.pathname.startsWith('/store');
    const isAdmin = location.pathname.startsWith('/admin');
    return !isStore && !isAdmin;
  },
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
