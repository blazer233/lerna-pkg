import { calNum } from 'pkgtools';
console.log(calNum)
export function setupCounter(element) {
  let counter = 0;
  const setCounter = count => {
    counter = calNum(count);
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
