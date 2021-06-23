<template>
  <div class="progress-bar-component">
    <div class="progress-bar">
      <div class="progress-bar__goal"></div>
      <div class="progress-bar__progress" :style="progressBarWidth"></div>
      <div class="progress-bar__border" style="width: 100%">
        <span v-if="label" class="progress-bar__label">{{ label }}</span>
      </div>
    </div>
    <div class="progress-bar-button">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goal: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
    },
  },
  computed: {
    progressBarWidth() {
      return `width: ${(this.progress / this.goal) * 100}%;`
    },
  },
}
</script>

<style lang="scss">
.progress-bar-component {
  height: 100%;
  position: relative;
  flex: 1;
  display: flex;
  top: $space-xx-small;
}

.progress-bar {
  position: relative;
  height: 100%;
  flex: 1;
  margin-right: $space-x-small;
}

.progress-bar__goal {
  position: relative;
  height: 26px; // styleguide-button-size
  border: 1px solid $color-primary;
  background: repeating-linear-gradient(120deg, $color-neutral-80, $color-neutral-70);
  border-radius: $border-radius-base;
}

.progress-bar__progress {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 26px; // styleguide-button-size
  max-width: 100%;
  background: repeating-linear-gradient(
    120deg,
    $color-primary 0px,
    $color-primary 30px,
    $color-primary-light 50px,
    $color-primary-light 75px,
    $color-primary 95px
  );
  border-radius: $border-radius-base;
}

.progress-bar__border {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 26px; // styleguide-button-size
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-base;
}

.progress-bar__label {
  position: relative;
  float: right;

  @media (max-width: 350px) {
    font-size: $font-size-small;
  }
}

.progress-bar-button {
  position: relative;
  float: right;
}
</style>
