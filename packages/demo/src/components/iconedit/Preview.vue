<template>
  <div class="outer">
    <svg
      style="width: 0; height: 0; position: absolute;"
      aria-hidden="true"
      focusable="false"
    >
      <linearGradient id="of-icon-grad-1" x2="100%" y2="100%">
        <!-- FIXME use variables -->
        <stop offset="0%" class="g g1" stop-color="#cfc998" />
        <stop offset="60%" class="g g2" stop-color="#deb887" />
      </linearGradient>
      <linearGradient id="of-icon-grad-2" x2="1" y2="1">
        <!-- FIXME use variables -->
        <stop offset="0%" class="g g1" stop-color="#fff" stop-opacity="0.6" />
        <stop offset="60%" class="g g2" stop-color="#fff" />
      </linearGradient>
    </svg>

    <canvas width="100" height="100" @vnodeMounted="upd"></canvas>
    <div class="tpl" ref="tpl"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, VNode } from 'vue'

function _roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | number[]
): Path2D {
  if (typeof radius === 'number') {
    radius = [radius, radius, radius, radius]
  }
  let path = new Path2D()
  path.moveTo(x + radius[0], y)
  path.lineTo(x + width - radius[1], y)
  path.quadraticCurveTo(x + width, y, x + width, y + radius[1])
  path.lineTo(x + width, y + height - radius[2])
  path.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius[2],
    y + height
  )
  path.lineTo(x + radius[3], y + height)
  path.quadraticCurveTo(x, y + height, x, y + height - radius[3])
  path.lineTo(x, y + radius[0])
  path.quadraticCurveTo(x, y, x + radius[0], y)
  path.closePath()
  return path
}

function draw(canvas?: HTMLCanvasElement, tpl?: HTMLDivElement) {
  var ctx = canvas?.getContext && canvas.getContext('2d')
  if (!ctx) {
    console.error('Cannot get canvas context')
    return
  }
  const {
    width: canvasWidth,
    height: canvasHeight,
  } = canvas!.getBoundingClientRect()

  // const doc = fetch('gear.svg').then(data => console.log(data))

  //   const svg =
  //     '<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="1000px" height="1000px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path id="GEAR" d="M846.052,440.738c46.14,0 83.592,37.538 83.592,83.592c0,46.227 -37.452,83.679 -83.592,83.679l-55.525,0c-6.343,22.157 -15.032,43.099 -25.98,62.823l39.275,39.275c32.585,32.586 32.585,85.504 0,118.088c-32.584,32.585 -85.503,32.585 -118.088,0l-39.275,-39.275c-19.899,10.948 -40.754,19.204 -63.084,25.807l0,55.525c0,46.227 -37.278,83.418 -83.418,83.418c-46.14,0 -83.505,-37.191 -83.505,-83.418l0,-55.612c-22.157,-6.17 -43.186,-14.858 -62.911,-25.807l-39.362,39.189c-32.586,32.585 -85.417,32.585 -118.088,0c-32.585,-32.585 -32.672,-85.503 0,-118.088l39.276,-39.363c-10.949,-19.725 -19.378,-40.666 -25.894,-62.823l-55.525,0c-46.228,0 -83.592,-37.452 -83.592,-83.505c0,-46.228 37.364,-83.591 83.592,-83.591l55.525,0c6.255,-22.159 14.945,-43.013 25.894,-62.911l-39.276,-39.276c-32.585,-32.584 -32.585,-85.503 0,-118.088c32.585,-32.584 85.502,-32.671 118.088,0l39.362,39.363c19.812,-10.949 40.754,-19.29 62.911,-25.894l0,-55.699c0,-46.053 37.365,-83.331 83.505,-83.331c46.14,0 83.418,37.278 83.418,83.331l0,55.699c22.33,6.17 43.098,14.945 62.997,25.894l39.362,-39.363c32.585,-32.584 85.417,-32.584 118.088,0c32.585,32.759 32.585,85.677 -0.086,118.262l-39.276,39.189c10.949,19.898 19.551,40.753 26.067,62.91l55.525,0Zm-229.408,133.487c26.617,-26.793 26.617,-70.183 0,-96.722l-64.521,-64.454c-26.785,-26.793 -69.911,-26.793 -96.698,0l-64.52,64.454c-26.786,26.876 -26.786,69.929 0,96.722l64.52,64.538c26.787,26.625 69.997,26.625 96.698,0l64.521,-64.538Z" style="fill-rule:nonzero;"/><path id="TOP" d="M791.688,453.857c38.891,0 70.46,31.64 70.46,70.459c0,38.965 -31.569,70.533 -70.46,70.533l-46.802,0c-5.347,18.677 -12.671,36.329 -21.899,52.954l33.105,33.105c27.466,27.467 27.466,72.071 0,99.537c-27.465,27.466 -72.071,27.466 -99.537,0l-33.104,-33.105c-16.773,9.228 -34.352,16.187 -53.174,21.752l0,46.802c0,38.965 -31.422,70.314 -70.313,70.314c-38.892,0 -70.387,-31.349 -70.387,-70.314l0,-46.875c-18.676,-5.201 -36.401,-12.524 -53.028,-21.753l-33.178,33.033c-27.467,27.466 -71.998,27.466 -99.536,0c-27.466,-27.466 -27.54,-72.071 0,-99.537l33.105,-33.179c-9.228,-16.626 -16.333,-34.277 -21.826,-52.954l-46.802,0c-38.965,0 -70.46,-31.568 -70.46,-70.386c0,-38.966 31.495,-70.459 70.46,-70.459l46.802,0c5.273,-18.678 12.598,-36.256 21.826,-53.028l-33.105,-33.106c-27.466,-27.465 -27.466,-72.07 0,-99.536c27.466,-27.465 72.069,-27.539 99.536,0l33.178,33.179c16.7,-9.229 34.352,-16.26 53.028,-21.826l0,-46.949c0,-38.818 31.495,-70.24 70.387,-70.24c38.891,0 70.313,31.422 70.313,70.24l0,46.949c18.822,5.201 36.327,12.597 53.1,21.826l33.178,-33.179c27.466,-27.465 71.999,-27.465 99.537,0c27.466,27.613 27.466,72.217 -0.072,99.683l-33.106,33.033c9.229,16.772 16.479,34.35 21.972,53.027l46.802,0Zm-193.369,112.516c22.436,-22.584 22.436,-59.157 0,-81.527l-54.384,-54.329c-22.578,-22.583 -58.929,-22.583 -81.507,0l-54.384,54.329c-22.578,22.654 -22.578,58.943 0,81.527l54.384,54.399c22.578,22.442 59,22.442 81.507,0l54.384,-54.399Z" style="fill:#cc3030;fill-rule:nonzero;"/></svg>'
  const svg =
    //'<svg width="24px" height="24px" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M4.427,12.845c-0.835,-0.329 -1.427,-1.143 -1.427,-2.095l0,-4.5c0,-1.242 1.008,-2.25 2.25,-2.25l13.5,0c1.242,0 2.25,1.008 2.25,2.25l0,4.5c0,1.242 -1.008,2.25 -2.25,2.25l-8.137,0c-0.333,-1.435 -1.602,-2.504 -3.113,-2.504c-1.456,0 -2.687,0.992 -3.073,2.349Z" opacity="0.3"/><path d="M6.41,16c-0.834,-0.405 -1.41,-1.261 -1.41,-2.25c0,-1.38 1.12,-2.5 2.5,-2.5c1.38,0 2.5,1.12 2.5,2.5c0,0.989 -0.576,1.845 -1.41,2.25l0.91,0c0.828,0 1.5,0.672 1.5,1.5l0,3c0,0.828 -0.672,1.5 -1.5,1.5l-4,0c-0.828,0 -1.5,-0.672 -1.5,-1.5l0,-3c0,-0.828 0.672,-1.5 1.5,-1.5l0.91,0Zm9.653,-7.947l3.129,0l0,-0.022c-0.011,-1.789 -1.409,-3.238 -3.129,-3.238l0,3.26Zm0,0.857l3,0l0,0.02c-0.011,1.647 -1.351,2.98 -3,2.98l0,-3Zm-0.993,-3.5l0,6.5c-1.932,0 -3.5,-1.456 -3.5,-3.25c0,-1.793 1.568,-3.25 3.5,-3.25Zm-10.761,8.555c-1.309,-0.212 -2.309,-1.347 -2.309,-2.715l0,-5.5c0,-1.518 1.232,-2.75 2.75,-2.75l14.5,0c1.518,0 2.75,1.232 2.75,2.75l0,5.5c0,1.518 -1.232,2.75 -2.75,2.75l-8.561,0c0.006,-0.083 0.009,-0.166 0.009,-0.25c0,-0.258 -0.029,-0.509 -0.085,-0.75l8.137,0c1.242,0 2.25,-1.008 2.25,-2.25l0,-4.5c0,-1.242 -1.008,-2.25 -2.25,-2.25l-13.5,0c-1.242,0 -2.25,1.008 -2.25,2.25l0,4.5c0,0.952 0.592,1.766 1.427,2.095c-0.081,0.287 -0.125,0.591 -0.125,0.905c0,0.072 0.002,0.144 0.007,0.215Z"/></svg>'
    '<svg width="24px" height="24px" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M4.427,12.845c-0.835,-0.329 -1.427,-1.143 -1.427,-2.095l0,-4.5c0,-1.242 1.008,-2.25 2.25,-2.25l13.5,0c1.242,0 2.25,1.008 2.25,2.25l0,4.5c0,1.242 -1.008,2.25 -2.25,2.25l-8.137,0c-0.333,-1.435 -1.602,-2.504 -3.113,-2.504c-1.456,0 -2.687,0.992 -3.073,2.349Z" opacity="0.3"/><path d="M6.41,16c-0.834,-0.405 -1.41,-1.261 -1.41,-2.25c0,-1.38 1.12,-2.5 2.5,-2.5c1.38,0 2.5,1.12 2.5,2.5c0,0.989 -0.576,1.845 -1.41,2.25l0.91,0c0.828,0 1.5,0.672 1.5,1.5l0,3c0,0.828 -0.672,1.5 -1.5,1.5l-4,0c-0.828,0 -1.5,-0.672 -1.5,-1.5l0,-3c0,-0.828 0.672,-1.5 1.5,-1.5l0.91,0Zm9.433,-7.717l3.611,0l0,-0.024c-0.012,-2.066 -1.626,-3.738 -3.611,-3.738l0,3.762Zm0,0.795l2.815,0l0,0.019c-0.009,1.545 -1.267,2.797 -2.815,2.797l0,-2.816Zm-0.773,-3.668l0,6.5c-1.932,0 -3.5,-1.456 -3.5,-3.25c0,-1.793 1.568,-3.25 3.5,-3.25Zm-10.761,8.555c-1.309,-0.212 -2.309,-1.347 -2.309,-2.715l0,-5.5c0,-1.518 1.232,-2.75 2.75,-2.75l14.5,0c1.518,0 2.75,1.232 2.75,2.75l0,5.5c0,1.518 -1.232,2.75 -2.75,2.75l-8.561,0c0.006,-0.083 0.009,-0.166 0.009,-0.25c0,-0.258 -0.029,-0.509 -0.085,-0.75l8.137,0c1.242,0 2.25,-1.008 2.25,-2.25l0,-4.5c0,-1.242 -1.008,-2.25 -2.25,-2.25l-13.5,0c-1.242,0 -2.25,1.008 -2.25,2.25l0,4.5c0,0.952 0.592,1.766 1.427,2.095c-0.081,0.287 -0.125,0.591 -0.125,0.905c0,0.072 0.002,0.144 0.007,0.215Z"/></svg>'
  //'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17.7 11.53c-.7.31-1.45.47-2.21.47C12.46 12 10 9.53 10 6.5c0-.17.01-.34.03-.5H4v14h14v-8.17l-.3-.3zM5.5 18l2.75-3.53 1.96 2.36 2.75-3.54L16.5 18h-11z" opacity=".3"/><path d="M10.21 16.83l-1.96-2.36L5.5 18h11l-3.54-4.71zM20 6.5C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42 22.42 12 19.3 8.89c.44-.7.7-1.51.7-2.39zM15.5 9C14.12 9 13 7.88 13 6.5S14.12 4 15.5 4 18 5.12 18 6.5 16.88 9 15.5 9zM18 20H4V6h6.03c.06-.72.27-1.39.58-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6.17l-2-2V20z"/></svg>'
  const svgDom = new DOMParser().parseFromString(svg, 'image/svg+xml')
  console.log(svgDom, svgDom.documentElement instanceof SVGSVGElement)
  let width = parseInt(svgDom.documentElement.getAttribute('width') || '', 10)
  let height = parseInt(svgDom.documentElement.getAttribute('height') || '', 10)
  // ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  ctx.scale(canvasWidth / width, canvasHeight / height)

  svgDom.documentElement.setAttribute('viewBox', `0 0 ${width} ${height}`)

  svgDom.documentElement.classList.add('one')
  tpl!.appendChild(svgDom.documentElement.cloneNode(true))

  for (const drawElt of svgDom.documentElement.children) {
    console.log((drawElt as SVGElement).style.opacity)
    if ((drawElt as SVGPathElement).getAttribute('opacity')) {
      drawElt.classList.add('alt')
    } else {
      drawElt.classList.add('pri')
    }
  }

  svgDom.documentElement.classList.replace('one', 'two')
  tpl!.appendChild(svgDom.documentElement.cloneNode(true))

  const div = document.createElement('div')
  div.classList.add('round')
  svgDom.documentElement.classList.remove('two')
  div.appendChild(svgDom.documentElement.cloneNode(true))
  tpl!.appendChild(div)

  const div2 = document.createElement('div')
  div2.classList.add('roundr')
  div2.appendChild(svgDom.documentElement.cloneNode(true))
  tpl!.appendChild(div2)

  const path = new Path2D() // roundedRect(ctx, 5, 5, width - 10, height - 10, 5)
  //ctx.fillStyle = 'white'
  for (const drawElt of svgDom.documentElement.children) {
    if (drawElt instanceof SVGPathElement) {
      const subpath = new Path2D(drawElt.getAttribute('d')!)
      const fill = drawElt.style.fill || drawElt.getAttribute('fill')
      if (!fill || fill === '#000000' || fill === '#000' || fill === 'black') {
        console.log('black')
      } else {
        console.log(fill)
      }
      //   ctx.fillStyle =
      //     drawElt.style.fill || drawElt.getAttribute('fill') || '#000'
      path.addPath(subpath)
    }
  }
  ctx.fill(path, 'evenodd')
}

export default defineComponent({
  name: 'OfIconpreview',
  setup(_props, _ctx) {
    const tpl = ref<HTMLDivElement>()
    const upd = (vnode: VNode) => {
      draw(vnode.el as HTMLCanvasElement, tpl.value)
    }
    return {
      tpl,
      upd,
    }
  },
})
</script>

<style>
canvas {
  margin: 10px;
}
.outer {
  display: flex;
}
.tpl {
  height: 100px;
}
.tpl svg {
  width: 100px;
  height: auto;
}
.tpl svg.one {
  margin: 10px;
  fill: darkblue;
}
.tpl svg.two {
  margin: 10px;
  fill: rgb(39, 139, 170);
}
.tpl svg.two .alt {
  fill: red;
}
.round {
  background: darkblue;
  border-radius: 50%;
  display: inline-flex;
  padding: 20px;
  height: 90px;
}
.round svg {
  fill: #def;
  width: 90px;
}
.roundr {
  background: #8893aa;
  border-radius: 20px;
  display: inline-flex;
  padding: 20px;
  margin-left: 20px;
  height: 90px;
  box-shadow: inset 0 -3px 0 3px rgba(0, 0, 0, 0.1);
}
.roundr svg {
  width: 90px;
}
.roundr svg .pri {
  fill: url(#of-icon-grad-1);
}
.roundr svg .alt {
  fill: url(#of-icon-grad-2);
  opacity: 1;
}
</style>
