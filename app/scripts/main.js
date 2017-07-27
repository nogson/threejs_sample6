(() => {

  window.addEventListener('load', () => {

    // 汎用変数の宣言
    let width = window.innerWidth; // ブラウザのクライアント領域の幅
    let height = window.innerHeight; // ブラウザのクライアント領域の高さ
    let targetDOM = document.getElementById('webgl'); // スクリーンとして使う DOM

    // three.js 定義されているオブジェクトに関連した変数を宣言
    let scene; // シーン
    let camera; // カメラ
    let renderer; // レンダラ
    let axis; //ガイド
    let grid; //ガイド
    let directional;
    let ambient;
    let zoomVal = 0;

    // 各種パラメータを設定するために定数オブジェクトを定義
    let CAMERA_PARAMETER = { // カメラに関するパラメータ
      fovy: 90,
      aspect: width / height,
      near: 0.1,
      far: 1000.0,
      x: 2.0, // + 右 , - 左
      y: 2, // + 上, - 下
      z: 30, // + 手前, - 奥
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0) //x,y,z
    };
    let RENDERER_PARAMETER = { // レンダラに関するパラメータ
      clearColor: 0xffffff, //背景のリセットに使う色
      width: width,
      height: height
    };

    let LIGHT_PARAMETER = {
      directional: {
        positionX: -0.5,
        positionY: 4,
        positionZ: 3
      },
      ambient: {
        positionY: 1
      }
    }

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      CAMERA_PARAMETER.fovy,
      CAMERA_PARAMETER.aspect,
      CAMERA_PARAMETER.near,
      CAMERA_PARAMETER.far
    );

    camera.position.x = CAMERA_PARAMETER.x;
    camera.position.y = CAMERA_PARAMETER.y;
    camera.position.z = CAMERA_PARAMETER.z;
    camera.lookAt(CAMERA_PARAMETER.lookAt); //注視点（どこをみてるの？）

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.clearColor));
    renderer.setSize(RENDERER_PARAMETER.width, RENDERER_PARAMETER.height);
    renderer.shadowMap.enabled = true;

    //renderer.shadowMap.enabled = true; //影を有効
    targetDOM.appendChild(renderer.domElement); //canvasを挿入する

    controls = new THREE.OrbitControls(camera, render.domElement);
    controls.autoRotate = true;
    controls.minDistance = 30;
    controls.maxDistance = 30;

    //ライト
    directional = new THREE.DirectionalLight(0xffffff);
    ambient = new THREE.AmbientLight(0xffffff, 0.25);

    directional.castShadow = true;


    directional.position.y = LIGHT_PARAMETER.directional.positionY;
    directional.position.z = LIGHT_PARAMETER.directional.positionZ;
    directional.position.x = LIGHT_PARAMETER.directional.positionX;
    ambient.position.y = LIGHT_PARAMETER.ambient.positionY;

    //directional.castShadow = true;
    directional.shadow.mapSize.width = 800;
    directional.shadow.mapSize.height = 800;
    scene.add(directional);
    scene.add(ambient);

    // axis = new THREE.AxisHelper(1000);
    // axis.position.set(0, 0, 0);
    // scene.add(axis);

    // // グリッドのインスタンス化
    // grid = new THREE.GridHelper(100, 50);

    // //グリッドオブジェクトをシーンに追加する
    // scene.add(grid);

    const PATH = 'images/';
    const FORMAT = '.jpg';
    let urls = [
      PATH + 'posx' + FORMAT,
      PATH + 'negx' + FORMAT,
      PATH + 'posy' + FORMAT,
      PATH + 'negy' + FORMAT,
      PATH + 'posz' + FORMAT,
      PATH + 'negz' + FORMAT,
    ];

    let cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.load(urls, function (cubeTexture) {

      createSkyBox(cubeTexture);

      createSphere(cubeTexture);

      //createSphere2(cubeTexture);

    });

    //skyboxを作成
    function createSkyBox(cubeTexture) {
      let shader = THREE.ShaderLib['cube'];
      shader.uniforms['tCube'].value = cubeTexture;

      let material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      });

      let skybox = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 200), material);

      scene.add(skybox);
    }

    //球を作成(反射マッピング)
    function createSphere(cubeTexture) {
      var geometry = new THREE.SphereGeometry(10, 60, 60);
      var torusMaterial = new THREE.MeshPhongMaterial({
        color: 0xCCCCCC,
        envMap: cubeTexture,
        reflectivity: 0.9
      });
      mesh = new THREE.Mesh(geometry, torusMaterial);
      scene.add(mesh);
    }

    //球を作成(屈折マッピング)
    function createSphere2(cubeTexture) {
      cubeTexture.mapping = THREE.CubeRefractionMapping;

      var geometry = new THREE.SphereGeometry(10, 60, 60);
      var torusMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        envMap: cubeTexture,
        refractionRatio: 0.9,
        reflectivity: 0.9
      });
      mesh = new THREE.Mesh(geometry, torusMaterial);
      scene.add(mesh);
    }

    render();

    //描画
    function render() {
      //player.position.z += 0.01;

      // rendering
      renderer.render(scene, camera);

      // animation
      requestAnimationFrame(render);
    }


  }, false);
})();

