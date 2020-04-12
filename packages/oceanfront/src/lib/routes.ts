import {
  Router,
  RouteLocationNormalizedResolved,
  RouteLocationNormalized
} from 'vue-router'

let useRoute: any = null,
  useRouter: any = null
try {
  const { useRoute: _useRoute, useRouter: _useRouter } = require('vue-router')
  useRoute = _useRoute
  useRouter = _useRouter
} catch (er) {
  console.log('vue-router not found')
}

class RouteAccessor {
  protected _router: Router
  protected _route: RouteLocationNormalizedResolved
  constructor(router: Router, route: RouteLocationNormalizedResolved) {
    this._router = router
    this._route = route
  }

  get activeRoute(): RouteLocationNormalizedResolved {
    return this._route
  }

  get router(): Router {
    return this._router
  }
}

export function useRoutes(): RouteAccessor | undefined {
  if (useRouter) {
    return new RouteAccessor(useRouter(), useRoute())
  }
}
