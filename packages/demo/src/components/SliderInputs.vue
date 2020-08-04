<template>
  <div class="container">
    <h1>Slider Inputs</h1>
    <div class="row">
      <div class="column md-8">
        <of-field
          type="slider"
          :value="{ value: '80', min: '20', max: '300', step: '1' }"
        />
      </div>
    </div>
  </div>
</template>
