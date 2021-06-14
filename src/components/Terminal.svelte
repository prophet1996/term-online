<script lang="ts">
  let cmdLets = [{}];
  export let username :string;
  let prompt = `${username}-:`;
</script>

<div
  class="md:container container sm:mx-auto px-4 py-6 bg-denim-500 dark:bg-denim-800 rounded"
>
  {#each cmdLets as cmd}
    <div>
      {prompt}
    </div>
  {/each}
</div>
