for (const pre of document.querySelectorAll("pre")) {
  const wrapper = document.createElement("div");
  wrapper.className = "code-block";
  pre.before(wrapper);
  wrapper.append(pre);

  const button = document.createElement("button");
  button.className = "copy-code";
  button.type = "button";
  button.textContent = "Copy";
  button.setAttribute("aria-label", "Copy code");
  button.addEventListener("click", async () => {
    await navigator.clipboard.writeText(pre.innerText);
    button.textContent = "Copied";
    window.setTimeout(() => { button.textContent = "Copy"; }, 1400);
  });
  wrapper.append(button);
}
