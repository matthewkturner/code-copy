const cleanCode = code => {
  let cleaned = '';  

  const wrapper = document.createElement('div');
  wrapper.innerHTML = code;
  cleaned += wrapper.textContent || wrapper.innerText || '';

  return cleaned;
}

const copy = event => {
  const { currentTarget } = event;
  const el = currentTarget.querySelector('code') || currentTarget;
  const html = el.innerHTML;
  const toast = document.createElement('div');
  toast.className = 'toast';
  const code = cleanCode(html);

  try {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.innerHTML = '<span>Copied successfully!</span>';
        toast.className += ' success';
        el.appendChild(toast); 
      })
      .catch(err => {
        toast.innerHTML = '<span>There was an error copying your text.</span>';
        toast.className += ' error';
        el.appendChild(toast); 
      });
  } catch (err) {
    toast.innerHTML = '<span>There was an error copying your text.</span>';
    toast.className += ' error';
    el.appendChild(toast); 
  }
};

const injectCssFromString = str => {
  const node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
};

const styles = `
  pre {
    position: relative;
  }

  .copy-code button {
    background-color: white;
    border: 0;
    border-radius: 4px;
    box-shadow: none;
    height: 30px;
    opacity: 0.6;
    padding: 7px;
    position: absolute;
    right: 10px;
    top: 10px;
    width: 30px;
  }

  .copy-code button img {
    width: 100%;
  }

  .copy-code button:hover {
    opacity: 1;
  }

  .copy-code button:hover path {
    fill: white;
  }

  .toast {
    color: white;
    font-family: 'Helvetica';
    left: 0;
    padding: 3px 5px;
    position: absolute;
    right: 0;
    top: 0;
  }

  .toast.success {
    background-color: green;
  }

  .toast.error {
    background-color: red;
  }
`;

let nodes = [...document.querySelectorAll('pre')];

for (let i = 0; i < nodes.length; i++) {
  const copyButton = document.createElement('button');
  nodes[i].className += ' copy-code';
  copyButton.className = `code-btn code-btn-${i}`;
  copyButton.innerHTML = `<img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDM0LjU1NSAzNC41NTUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDM0LjU1NSAzNC41NTU7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8Zz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBkPSJNMjQuMDY1LDM0LjU1NUg1LjQ4OWMtMS4zNzksMC0yLjUtMS4xMjItMi41LTIuNVY3Ljg2NGMwLTEuMzc4LDEuMTIxLTIuNSwyLjUtMi41aDIuMzY0YzAuMjc2LDAsMC41LDAuMjI0LDAuNSwwLjUgICAgIHMtMC4yMjQsMC41LTAuNSwwLjVINS40ODljLTAuODI3LDAtMS41LDAuNjczLTEuNSwxLjV2MjQuMTljMCwwLjgyNywwLjY3MywxLjUsMS41LDEuNWgxOC41NzZjMC44MjcsMCwxLjUtMC42NzMsMS41LTEuNXYtMi4zNjUgICAgIGMwLTAuMjc2LDAuMjI0LTAuNSwwLjUtMC41czAuNSwwLjIyNCwwLjUsMC41djIuMzY1QzI2LjU2NSwzMy40MzMsMjUuNDQ0LDM0LjU1NSwyNC4wNjUsMzQuNTU1eiIgZmlsbD0iIzAwMDAwMCIvPgoJCTwvZz4KCTwvZz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBkPSJNMjkuMDY1LDI5LjE5SDEwLjQ4OWMtMS4zNzksMC0yLjUtMS4xMjItMi41LTIuNVYyLjVjMC0xLjM3OCwxLjEyMS0yLjUsMi41LTIuNWgxMy42MDRjMC4yNzYsMCwwLjUsMC4yMjQsMC41LDAuNSAgICAgUzI0LjM3LDEsMjQuMDk0LDFIMTAuNDg5Yy0wLjgyNywwLTEuNSwwLjY3My0xLjUsMS41djI0LjE5YzAsMC44MjcsMC42NzMsMS41LDEuNSwxLjVoMTguNTc2YzAuODI3LDAsMS41LTAuNjczLDEuNS0xLjVWNy42NjEgICAgIGMwLTAuMjc2LDAuMjI0LTAuNSwwLjUtMC41czAuNSwwLjIyNCwwLjUsMC41VjI2LjY5QzMxLjU2NSwyOC4wNjksMzAuNDQ0LDI5LjE5LDI5LjA2NSwyOS4xOXoiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBhdGggZD0iTTMxLjA2NSw4LjE2MWgtNi45NzJjLTAuMjc2LDAtMC41LTAuMjI0LTAuNS0wLjVWMC42ODhjMC0wLjI3NiwwLjIyNC0wLjUsMC41LTAuNXMwLjUsMC4yMjQsMC41LDAuNXY2LjQ3M2g2LjQ3MiAgICAgYzAuMjc2LDAsMC41LDAuMjI0LDAuNSwwLjVTMzEuMzQyLDguMTYxLDMxLjA2NSw4LjE2MXoiIGZpbGw9IiMwMDAwMDAiLz4KCQkJPHBhdGggZD0iTTMxLjA2NSw4LjE2MWMtMC4xMywwLTAuMjYtMC4wNTEtMC4zNTgtMC4xNTFsLTYuOTcyLTcuMTYxYy0wLjE5Mi0wLjE5OC0wLjE4OC0wLjUxNCwwLjAxLTAuNzA3ICAgICBjMC4xOTctMC4xOTEsMC41MTYtMC4xODcsMC43MDcsMC4wMWw2Ljk3Miw3LjE2MWMwLjE5MiwwLjE5OCwwLjE4OCwwLjUxNC0wLjAxLDAuNzA3QzMxLjMxNyw4LjExNCwzMS4xOTEsOC4xNjEsMzEuMDY1LDguMTYxeiIgZmlsbD0iIzAwMDAwMCIvPgoJCTwvZz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />`;
  nodes[i].appendChild(copyButton);

  nodes[i].addEventListener('click', copy);
}

injectCssFromString(styles);
