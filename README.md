// twin.scene.traverse((obj) => {
//     if (obj.userData.rangingNum === mesh.object.userData.rangingNum) {
//         twin.scene.remove(rangingGroup);
//         if (obj.isMesh) {
//             rangingGroup.remove(obj);
//         } else if (obj.isCSS2DObject) {
//             obj.element.innerHTML = '';
//         }

//         if (obj.userData.type === '尺寸') {
//             obj.element.style.display = 'none';
//             console.log('obj---', obj);
//         }
//     }
// });
// three.module.js:7684 Uncaught TypeError: Cannot read properties of undefined (reading 'traverse')
// traverse 会报上一行的错， 所以使用foreach
