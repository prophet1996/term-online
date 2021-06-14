<script lang="ts">
  import { onMount, tick } from "svelte";

  export let username: string;
  let prompt = `${username} :`;
  let terminalRef: HTMLTextAreaElement;
  let cmdLets = [{ value: "" }];

  onMount(() => {
    terminalRef.style.height = "24px";
    terminalRef.focus();
  });
  const handlePageClick = () => {
    terminalRef.focus();
  };

  const autoTerminalInputResize = () => {
    const row = Math.min(
      Math.ceil(
        (terminalRef.value.length * 0.6 * 16) / terminalRef.offsetWidth
      ),
      20
    );
    console.log(row);
    terminalRef.style.height = `${row * 24}px`;
  };

  const handleCmdKeyDown = async (event) => {
    if (event.code === "Enter") {
      event.preventDefault();
      cmdLets = [...cmdLets, { value: "" }];
      await tick();
      terminalRef.focus();
    }
  };
</script>

<svelte:window on:click={handlePageClick} on:resize={autoTerminalInputResize} />

{#each cmdLets as cmd, idx}
  <div
    class="md:container container sm:mx-auto px-4 py-6 bg-denim-500 dark:bg-denim-800 rounded"
  >
    <div class="flex flex-row gap-4 items-start">
      <span class="flex-1 flex-initial">
        {prompt}
      </span>
      <!-- svelte-ignore a11y-autofocus -->
      {#if idx === cmdLets.length - 1}
        <textarea
          bind:this={terminalRef}
          on:input={autoTerminalInputResize}
          bind:value={cmd.value}
          on:keydown={handleCmdKeyDown}
          class="flex-1 w-full bg-denim-500 dark:bg-denim-800 border-none focus:outline-none resize-none"
        />
      {:else}
        <textarea
          disabled={true}
          bind:value={cmd.value}
          class="flex-1 w-full bg-denim-500 dark:bg-denim-800 border-none focus:outline-none resize-none"
        />
      {/if}
    </div>
  </div>
{/each}
