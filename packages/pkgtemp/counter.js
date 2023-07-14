import { fixedToWByValueNum } from 'pkgtools';

export function setupCounter(element) {
  let counter = 0;
  const setCounter = count => {
    element.innerHTML = `count is ${count} ${fixedToWByValueNum(
      Math.random() * 100000000
    )}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
