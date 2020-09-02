<template>
  <div class="container">
    <h1>Slider Inputs</h1>
    <div class="row">
      <div class="column md-8">
        <of-field
          :format="{ min: 1, max: 500, step: 10, value: 1000 }"
          type="slider"
        ></of-field>
        <!--
        <br /><br />
        <of-field
          :format="{ min: 1, max: 500, step: 12, value: 1000 }"
          type="slider"
          variant="outlined"
        ></of-field>
        <br /><br />
        <of-field
          :format="{ min: 1, max: 500, step: 12, value: 1000 }"
          type="slider"
          variant="filled"
        ></of-field>
        -->
      </div>
    </div>
  </div>
</template>
