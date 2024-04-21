import * as THREE from 'three';

// mesh顶部中心添加标注，顶部中心坐标是(0,100,0)
const geometry = new THREE.BoxGeometry(25, 100, 50);
geometry.translate(0, 50, 0);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff
});
const mesh = new THREE.Mesh(geometry, material);
const group = new THREE.Group();
group.add(mesh);

// 创建精灵
const texture = new THREE.TextureLoader().load('./光点.png');
const spriteMaterial = new THREE.SpriteMaterial({
    map: texture, // 设置精灵纹理贴图
    // transparent: true 默认true
});
const sprite = new THREE.Sprite(spriteMaterial);
// 控制精灵大小
sprite.scale.set(10, 10, 1);
// 设置精灵模型在三维空间中的位置坐标
sprite.position.set(0, 100 + 10 / 2, 0);
group.add(sprite);

export default group;
