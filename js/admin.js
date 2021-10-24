import {
  validarCodigo,
  validarCampoRequerido,
  validarNumeros,
  validarURL,
  validarGeneral,
} from "./validaciones.js";
import { Producto } from "./productoClass.js";

// traer los input/textarea
let codigo = document.querySelector("#codigo");
let cantidad = document.querySelector("#cantidad");
let url = document.querySelector("#url");
let producto = document.querySelector("#producto");
let descripcion = document.querySelector("#descripcion");
let formulario = document.querySelector("#formProducto");
let listaProductos = [];
let productoExistente = false; //si es falso tengo que agregar un nuevo producto
//   true tengo q editar el producto
let btnNuevoProducto = document.querySelector("#btnNuevoProducto");

cargaInicial();

// le agregamos el evento
codigo.addEventListener("blur", () => {
  validarCodigo(codigo);
});
cantidad.addEventListener("blur", () => {
  validarNumeros(cantidad);
});
url.addEventListener("blur", () => {
  validarURL(url);
});
producto.addEventListener("blur", () => {
  validarCampoRequerido(producto);
});
descripcion.addEventListener("blur", () => {
  validarCampoRequerido(descripcion);
});
formulario.addEventListener("submit", guardarProducto);
btnNuevoProducto.addEventListener("click", limpiarFormulario);

function guardarProducto(e) {
  e.preventDefault();
  if (validarGeneral()) {
    if (productoExistente === false) {
      //tengo que crear producto
      agregarProducto();
    } else {
      // tengo q modificar el producto
      console.log("aqui modifico");
      actualizarProducto()
    }
  } else {
    //aqui no hacemos nada
  }
}

function agregarProducto() {
  //crear producto
  let productoNuevo = new Producto(
    codigo.value,
    producto.value,
    descripcion.value,
    cantidad.value,
    url.value
  );

  //cargar el producto dentro del arreglo
  listaProductos.push(productoNuevo);
  console.log(listaProductos);
  // al arreglo lo almaceno en localstorage
  localStorage.setItem("arregloProductos", JSON.stringify(listaProductos));
  //limpiar formulario
  limpiarFormulario();
  //cargar el producti nuevo en la fila
  crearFilas(productoNuevo);
  //mostrar mensaje a un usuario
}

function limpiarFormulario() {
  //limpia los value de mis input
  formulario.reset();
  //limpiar los estilos
  codigo.className = "form-control";
  cantidad.className = "form-control";
  url.className = "form-control";
  producto.className = "form-control";
  descripcion.className = "form-control";
  //reseteaar el valor de la variable booleana
  productoExistente = false;
}

function cargaInicial() {
  //traer los productos de localStorage si existieran si no deja vacio
  listaProductos = JSON.parse(localStorage.getItem("arregloProductos")) || [];
  //si hay productos en el arreglo crea fila
  listaProductos.forEach((itemProducto) => {
    //codigo q se ejecuta por cada elemento del arreglo
    crearFilas(itemProducto);
  });
}

function crearFilas(itemProducto) {
  let tabla = document.querySelector("#tablaProducto");
  console.log(itemProducto);
  tabla.innerHTML += ` <tr>
    <th scope="row">${itemProducto.codigo}</th>
    <td>${itemProducto.nombre}</td>
    <td>${itemProducto.descripcion}</td>
    <td>${itemProducto.cantidad}</td>
    <td>${itemProducto.url}</td>
    <td>
      <button class="btn btn-warning" onclick="prepararEdicion('${itemProducto.codigo}')">Editar</button>
      <button class="btn btn-danger">Borrar</button>
    </td>
  </tr>`;
}

window.prepararEdicion = (codigoProducto) => {
  console.log(codigoProducto);
  //buscar objeto
  let productoBuscado = listaProductos.find((itemProducto) => {
    return itemProducto.codigo == codigoProducto;
  });
  console.log(productoBuscado);
  //mostar en el formulario
  codigo.value = productoBuscado.codigo;
  cantidad.value = productoBuscado.cantidad;
  descripcion.value = productoBuscado.descripcion;
  url.value = productoBuscado.url;
  producto.value = productoBuscado.nombre;
  // cambio el valor producto existente
  productoExistente = true;
};

function actualizarProducto() {
  //buscar posicion del arreglo
  let posicionProducto = listaProductos.findIndex((itemProducto) => {
    return itemProducto.codigo == codigo.value;
  });
  console.log(posicionProducto);
  //modificar los datos de la posicion del arreglo
  listaProductos[posicionProducto].nombre = producto.value 
  listaProductos[posicionProducto].cantidad = cantidad.value 
  listaProductos[posicionProducto].descripcion = descripcion.value 
  listaProductos[posicionProducto].url = url.value 

  //modificar el localStorage
localStorage.setItem('arregloProductos', JSON.stringify(listaProductos))
  //volver a dibujar la tabla
  borrarFilas()
  listaProductos.forEach((itemProducto)=>{crearFilas(itemProducto)})
limpiarFormulario()
}

function borrarFilas(){
    let tabla = document.querySelector("#tablaProducto");
    tabla.innerHTML= ''

}