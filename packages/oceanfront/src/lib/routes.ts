import {
  Router,
  RouteLocationNormalizedLoaded,
  useRoute,
  useRouter,
} from 'vue-router'

class RouteAccessor {
  protected _router: Router
  protected _route: RouteLocationNormalizedLoaded
  constructor(router: Router, route: RouteLocationNormalizedLoaded) {
    this._router = router
    this._route = route
  }

  get activeRoute(): RouteLocationNormalizedLoaded {
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
