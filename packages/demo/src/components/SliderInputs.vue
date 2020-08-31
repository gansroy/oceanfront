<template>
  <div class="container">
    <h1>Slider Inputs</h1>
    <div class="row">
      <div class="column md-8">
        <of-field
          :format="{ min: 1, max: 500, step: 1 }"
          type="slider"
        ></of-field>
      </div>
    </div>
  </div>
</template>
