<template>
	<div class="app">hello world!</div>
</template>

<script>
  export default {
    name: "app",
    created() {
      util.log('hello world!');
    }
  }
</script>

<style>
	body {
		background: red;
	}
</style>
<style lang="scss" scoped>
	.app {
		font-size: r(32);
		background: #0baccc;
	}
</style>