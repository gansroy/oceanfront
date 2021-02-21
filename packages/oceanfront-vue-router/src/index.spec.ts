import { Oceanfront, useNav } from "oceanfront";
import { computed, defineComponent } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { registerVueRouter } from "..";
import { mount } from "@vue/test-utils";

test("register", async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: "index", component: { template: "INDEX" } },
      { path: "/test", name: "test", component: { template: "TEST" } },
    ],
  });

  const app = defineComponent({
    setup() {
      const nav = useNav();
      const active = computed(() => nav.routeActive("/"));
      return { active };
    },
    template: "<div>active:{{active}} <router-view /></div>",
  });

  const wrapped = mount(app, {
    global: {
      plugins: [
        [
          Oceanfront,
          {
            config: () => {
              registerVueRouter();
            },
          },
        ],
        router,
      ],
    },
  });

  await router.push("/");
  await router.isReady();

  expect(wrapped.text()).toContain("active:true");
  expect(wrapped.text()).toContain("INDEX");

  await router.push("/test");

  expect(wrapped.text()).toContain("active:false");
  expect(wrapped.text()).toContain("TEST");
});
