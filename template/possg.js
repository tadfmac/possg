// possg.js
// copy-to-clipboard button for article code blocks
(function () {
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return Promise.resolve();
  }

  function addCopyButtons() {
    document.querySelectorAll("article pre").forEach((pre) => {
      const code = pre.querySelector("code");
      if (!code) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "copyBtn";
      button.textContent = "Copy";

      button.addEventListener("click", () => {
        copyText(code.textContent).then(() => {
          button.textContent = "Copied!";
          setTimeout(() => {
            button.textContent = "Copy";
          }, 1500);
        });
      });

      pre.appendChild(button);
    });
  }

  addCopyButtons();
})();
