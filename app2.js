document.addEventListener("DOMContentLoaded", function () {
  const productosContainer = document.getElementById("productos");
  const carritoContainer = document.getElementById("carrito");
  let carrito = [];

  // Obtener el carrito desde localStorage al cargar la página
  const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];

  /* este lo borro porque quiero que salga el alert solo en index no en el carrito
    if ((carritoGuardado.length >= 1)) {
        alert("Guardamos tu compra en el local storage, puedes agregar más productos!");
        carrito = carritoGuardado;
        actualizarCarrito();
    } else {
        alert("No tienes productos agregados");
    }           */

  if (carritoGuardado.length >= 1) {
    // Verificar si la página actual es index.html
    if (
      window.location.pathname === "/index.html" ||
      window.location.pathname === "/"
    ) {
      alert(
        "Guardamos tu compra en el local storage, puedes agregar más productos!"
      );
    }
    carrito = carritoGuardado;
    actualizarCarrito();
  } else {
    // Verificar si la página actual es index.html
    if (
      window.location.pathname === "/index.html" ||
      window.location.pathname === "/"
    ) {
      alert("No tienes productos agregados");
    }
  }

  // Resto de tu código ...

  const productos = [
    {
      nombre: "Call of Duty Modern Warfare 1 reboot",
      valor: 10000,
      descripcion: "Nuevo",
      img: "./imagen/mw1.jpg",
    },
    {
      nombre: "Call of Duty Modern Warfare 2 reboot",
      valor: 20000,
      descripcion: "Nuevo",
      img: "./imagen/mw2.jpg",
    },
    {
      nombre: "Call of Duty Modern Warfare 3 reboot",
      valor: 30000,
      descripcion: "Nuevo",
      img: "./imagen/mw3.jpg",
    },
  ];

  // Función para agregar productos al contenedor
  function mostrarProductos() {
    productos.forEach((producto) => {
      const productoElement = document.createElement("div");
      productoElement.classList.add("producto");

      //1 locale precio formateado
      const precioFormateado = producto.valor.toLocaleString("es-ES", {
        style: "currency",
        currency: "CLP",
      });

      productoElement.innerHTML = `
                <h2>${producto.nombre}</h2>
                <p>${producto.descripcion}</p>
                <p>Precio: ${precioFormateado}</p>
                <img src="${producto.img}" alt="${producto.nombre}">
                <button onclick="agregarAlCarrito('${producto.nombre}', ${producto.valor}, '${producto.img}')">Agregar al carrito</button>  
            `;

      productosContainer.appendChild(productoElement);
    });
  }

  // Función para agregar al carrito      // windows pa ra destinarl a al ambito global
  window.agregarAlCarrito = function (nombre, valor, img) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add to cart!",
      cancelButtonText: "No, cancel", // Cambia el texto del botón de cancelar
    }).then((result) => {
      if (result.isConfirmed) {
        const productoEnCarrito = carrito.find(
          (item) => item.nombre === nombre
        );

        if (productoEnCarrito) {
          productoEnCarrito.cantidad += 1;
        } else {
          carrito.push({ nombre, valor, cantidad: 1 });
        }
        // Guardar carrito en localStorage
        localStorage.setItem("carrito", JSON.stringify(carrito));
        // Formatear el valor para la alerta
        const valorFormateado = valor.toLocaleString("es-ES", {
          style: "currency",
          currency: "CLP",
        });
        // Actualizar la interfaz del carrito
        actualizarCarrito();

        // Mostrar una alerta
        Swal.fire({
          title: "Added!",
          text: `${nombre} has been added to the cart for ${valorFormateado}.`,
          imageUrl: `${img}`,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: "Custom image",
        });
      } else {
        // Mostrar mensaje adicional si el usuario hace clic en "No, cancel"
        Toastify({
          text: "Operatcion cancelada!",
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      }
    });
  };

  // Función para eliminar un producto del carrito
  window.eliminarDelCarrito = function (nombre) {
    const productoIndex = carrito.findIndex((item) => item.nombre === nombre);

    if (productoIndex !== -1) {
      carrito.splice(productoIndex, 1);

      // Guardar carrito en localStorage
      localStorage.setItem("carrito", JSON.stringify(carrito));

      actualizarCarrito();
      
      Toastify({
        text: (`¡${nombre} eliminado del carrito!`),
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();


      alert(`¡${nombre} eliminado del carrito!`);
    }
  };

  // Función para actualizar la visualización del carrito
  function actualizarCarrito() {
    carritoContainer.innerHTML = "<h2>Carrito de Compras</h2>";

    let totalCarrito = 0;
    let numProductosCarrito = 0; // Nueva variable para contar el número de productos en el carrito

    carrito.map((item) => {
      const itemElement = document.createElement("div");
      const subtotal = item.valor * item.cantidad;
      totalCarrito += subtotal;
      numProductosCarrito += item.cantidad; // Incrementar el contador

      //3 locale subtotal a cl
      const subtotalFormateado = subtotal.toLocaleString("es-ES", {
        style: "currency",
        currency: "CLP",
      });

      itemElement.innerHTML = `
                <p>${item.nombre} x${item.cantidad} - Subtotal: ${subtotalFormateado}
                <button onclick="eliminarDelCarrito('${item.nombre}')">Eliminar</button></p>
            `;
      carritoContainer.appendChild(itemElement);
    });

    //4   locale tranformar total carrito
    const totalCarritoFormateado = totalCarrito.toLocaleString("es-ES", {
      style: "currency",
      currency: "CLP",
    });

    const totalElement = document.createElement("div");
    totalElement.innerHTML = `<p>Total del Carrito: ${totalCarritoFormateado}</p>`;

    carritoContainer.appendChild(totalElement);

    // Actualizar el número de productos en el carrito
    const numProductosCarritoElement = document.getElementById(
      "numProductosCarrito"
    );
    numProductosCarritoElement.textContent = ` (${numProductosCarrito})`;
  }

  // Llama a la función para mostrar los productos
  mostrarProductos();


  if (carrito.length > 0) {
  // Configura un temporizador para mostrar el aviso y borrar el carrito después de 10 segundos
  setTimeout(function () {
    // Mostrar mensaje de aviso
    alert("Tu carrito se borrará en 20 segundos");
  
    // Configura un segundo temporizador para borrar el carrito después de 10 segundos adicionales
    setTimeout(function () {
      // Limpiar el carrito
      carrito = [];
      // Guardar carrito vacío en localStorage
      localStorage.setItem("carrito", JSON.stringify(carrito));
      // Actualizar la interfaz del carrito
      actualizarCarrito();
      // Mostrar mensaje de carrito eliminado
      alert("Tu carrito se ha borrado después de 10 segundos");
    }, 20000); // 10000 milisegundos = 10 segundos para el segundo temporizador
  }, 10000); // 10000 milisegundos = 10 segundos para el primer temporizador
}
});
