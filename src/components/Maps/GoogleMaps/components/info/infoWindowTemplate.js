export function infoWindowTemplate({ title = "", rows = [], backgroundImage = "" }) {
    return `
  <div class="info-window" style="background-image: url(${backgroundImage})"}>
    <h5>${title}</h5>
   ${rows
       .filter(({ text }) => text)
       .map(
           ({ strong, text }, index, arr) => `
   <strong>${strong ? strong : ""}</strong> <span>${text}</span> ${
               index < arr.length - 1 ? "</br>" : ""
           }`
       )}
       </div>`.replaceAll(",", "");
}

export function infoLine({ text, backgroundImage = "" }) {
    return `
<div class="info-window" style="background-image: url(${backgroundImage})"}>
 <strong> <p>${text}</p></strong>
 
</div>
`;
}
