<template>
  <div class="container">
    <h1>Slider Inputs</h1>
    <div class="row">
      <div class="column md-8">
        <of-field
          :format="{ min: 1, max: 500, step: 10, value: 1 }"
          type="slider"
          label="Select input"
        ></of-field>
        <br /><br />
        <of-field
          :format="{ min: 1, max: 500, step: 10, value: 250 }"
          type="slider"
          variant="outlined"
          label="Select input"
        ></of-field>
        <br /><br />
        <of-field
          :format="{ min: 1, max: 500, step: 10, value: 500 }"
          type="slider"
          variant="filled"
          label="Select input"
        ></of-field>
      </div>
    </div>
  </div>
</template>
