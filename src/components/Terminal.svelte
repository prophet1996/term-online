<script lang="ts">
  import { onMount, tick } from "svelte";

  export let username: string;
  let prompt = `${username} :`;
  let terminalRef: HTMLTextAreaElement;
  let cmdLets = [{ value: "" }];
  let fontSize = 16;
  let heights = [];
  onMount(() => {
    terminalRef.style.height = "24px";
    terminalRef.focus();
    try {
      fontSize = parseInt(window.getComputedStyle(terminalRef).fontSize);
    } catch (e) {
      console.error("cannot get the font size of terminal");
    }
  });
  const handlePageClick = () => {
    terminalRef.focus();
  };

  const getComputedTextAreaHeight = (ref, idx) => {
    if (ref) {
      return (
        Math.min(
          Math.ceil((ref.value.length * 0.6 * fontSize) / ref.offsetWidth),
          20
        ) * 24
      );
    } else {
      return heights[idx];
    }
  };
  const autoTerminalInputResize = () => {
    const textAreaHeight = getComputedTextAreaHeight(terminalRef,null);
    terminalRef.style.height = `${textAreaHeight}px`;
  };

  const handleCmdKeyDown = async (event) => {
    if (event.code === "Enter") {
      event.preventDefault();
      cmdLets = [...cmdLets, { value: "" }];
      heights.push(terminalRef.offsetHeight);
      await tick();
      terminalRef.focus();
      autoTerminalInputResize();
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
          style={`height:${getComputedTextAreaHeight(null,idx)}px`}
          bind:value={cmd.value}
          class="flex-1 w-full bg-denim-500 dark:bg-denim-800 border-none focus:outline-none resize-none"
        />
      {/if}
    </div>
  </div>
{/each}
