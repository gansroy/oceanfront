import { NavTo, setRouter } from "oceanfront";
import { useLink, useRouter } from "vue-router";

export function registerVueRouter(): void {
  const router = useRouter();

  setRouter({
    routeActive(target?: NavTo): boolean {
      const link = target && useLink({ to: target });
      return (link && link.isActive.value) || false;
    },
    routeNavigate(target: NavTo): Promise<void | string> | null {
      return router.push(target).then((err) => (err ? err.message : undefined));
    },
    routeResolve(target?: NavTo): string | null {
      return (target && router.resolve(target)?.href) || null;
    },
  });
}
