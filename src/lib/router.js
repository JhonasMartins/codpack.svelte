import { writable, derived } from 'svelte/store';

// Store para a rota atual
export const currentRoute = writable({
  name: 'home',
  params: {},
  query: {}
});

// Store para histórico de navegação
export const routeHistory = writable([]);

// Definição das rotas
export const routes = {
  home: {
    path: '/',
    component: 'home'
  },
  list: {
    path: '/list/:type',
    component: 'list'
  },
  detail: {
    path: '/detail/:type/:id',
    component: 'detail'
  }
};

// Função para navegar para uma rota
export function navigate(routeName, params = {}, query = {}) {
  console.log('🚀 Navegando para:', routeName, { params, query });
  
  const route = {
    name: routeName,
    params,
    query
  };
  
  // Atualizar histórico
  routeHistory.update(history => {
    const newHistory = [...history, route];
    // Manter apenas os últimos 10 itens do histórico
    return newHistory.slice(-10);
  });
  
  // Atualizar rota atual
  currentRoute.set(route);
  
  // Atualizar URL sem recarregar a página
  const url = buildUrl(routeName, params, query);
  window.history.pushState({ route }, '', url);
}

// Função para voltar na navegação
export function goBack() {
  console.log('⬅️ Voltando na navegação');
  
  let history = [];
  const unsubscribe = routeHistory.subscribe(h => history = h);
  unsubscribe();
  
  if (history && history.length > 1) {
    // Remove a rota atual e vai para a anterior
    const previousRoute = history[history.length - 2];
    routeHistory.update(h => h.slice(0, -1));
    currentRoute.set(previousRoute);
    
    const url = buildUrl(previousRoute.name, previousRoute.params, previousRoute.query);
    window.history.pushState({ route: previousRoute }, '', url);
  } else {
    // Se não há histórico, vai para home
    navigate('home');
  }
}

// Função para ir para home
export function goHome() {
  console.log('🏠 Indo para home');
  navigate('home');
}

// Função para construir URL
function buildUrl(routeName, params = {}, query = {}) {
  const route = routes[routeName];
  if (!route) return '/';
  
  let path = route.path;
  
  // Substituir parâmetros na URL
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  
  // Adicionar query parameters
  const queryString = new URLSearchParams(query).toString();
  return queryString ? `${path}?${queryString}` : path;
}

// Função para parsear URL atual
function parseUrl(url) {
  const urlObj = new URL(url, window.location.origin);
  const pathname = urlObj.pathname;
  const query = Object.fromEntries(urlObj.searchParams);
  
  // Encontrar rota correspondente
  for (const [routeName, route] of Object.entries(routes)) {
    const params = matchRoute(pathname, route.path);
    if (params !== null) {
      return { name: routeName, params, query };
    }
  }
  
  // Se não encontrou rota, retorna home
  return { name: 'home', params: {}, query: {} };
}

// Função para verificar se uma URL corresponde a uma rota
function matchRoute(pathname, routePath) {
  const pathParts = pathname.split('/').filter(Boolean);
  const routeParts = routePath.split('/').filter(Boolean);
  
  if (pathParts.length !== routeParts.length) {
    return null;
  }
  
  const params = {};
  
  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const pathPart = pathParts[i];
    
    if (routePart.startsWith(':')) {
      // É um parâmetro
      const paramName = routePart.slice(1);
      params[paramName] = pathPart;
    } else if (routePart !== pathPart) {
      // Não corresponde
      return null;
    }
  }
  
  return params;
}

// Inicializar roteador
export function initRouter() {
  console.log('🔧 Inicializando roteador');
  
  // Parsear URL inicial
  const initialRoute = parseUrl(window.location.href);
  currentRoute.set(initialRoute);
  routeHistory.set([initialRoute]);
  
  // Escutar mudanças no histórico do navegador
  window.addEventListener('popstate', (event) => {
    console.log('📍 Mudança no histórico detectada');
    const route = event.state?.route || parseUrl(window.location.href);
    currentRoute.set(route);
  });
  
  // Escutar mudanças diretas na URL (hashchange ou manual)
  let lastUrl = window.location.href;
  const checkUrlChange = () => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      console.log('🔄 Mudança de URL detectada:', currentUrl);
      lastUrl = currentUrl;
      const route = parseUrl(currentUrl);
      currentRoute.set(route);
    }
  };
  
  // Verificar mudanças de URL periodicamente
  setInterval(checkUrlChange, 100);
  
  // Também escutar hashchange para mudanças imediatas
  window.addEventListener('hashchange', checkUrlChange);
  
  console.log('✅ Roteador inicializado com rota:', initialRoute);
}

// Store derivado para facilitar o acesso aos dados da rota
export const routeData = derived(currentRoute, ($currentRoute) => ({
  isHome: $currentRoute.name === 'home',
  isList: $currentRoute.name === 'list',
  isDetail: $currentRoute.name === 'detail',
  listType: $currentRoute.params.type,
  detailType: $currentRoute.params.type,
  detailId: $currentRoute.params.id,
  query: $currentRoute.query
}));

// Funções de conveniência para navegação
export const router = {
  home: () => navigate('home'),
  list: (type) => navigate('list', { type }),
  detail: (type, id) => navigate('detail', { type, id }),
  back: goBack
};