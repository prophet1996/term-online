<script lang="typescript">
  let cmdLets = [{}];
  export let username: string;
  let prompt = `${username} :`;
  let terminalRef:HTMLTextAreaElement ;

  const handlePageClick = ()=>{
    terminalRef.focus();
  }
</script>
<svelte:window on:click={handlePageClick}/>

<div
  class="md:container container sm:mx-auto px-4 py-6 bg-denim-500 dark:bg-denim-800 rounded"
>
  {#each cmdLets as cmd}
    <div class="flex flex-row gap-4">
      <span class="flex-1 flex-initial">
        {prompt}
      </span>
      <!-- svelte-ignore a11y-autofocus -->
      <textarea bind:this={terminalRef} autofocus class="flex-1 w-full bg-denim-500 dark:bg-denim-800 border-none focus:outline-none"/>
    </div>
  {/each}
</div>
