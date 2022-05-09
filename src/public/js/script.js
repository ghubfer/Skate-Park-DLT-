const limpiarTabla = (async () => {

    const { data } = await axios.get('/usuario');

    if (data.length > 0) {

        $(".tbody").html('');

    };

})();

const actualizarEstado = (async () => {

    let statusCheck = document.querySelectorAll('.statusCheckbox');

    for (skater of statusCheck) {

        skater.addEventListener('click', async (e) => {

            try {

                const estado = e.target.checked;
                const id = e.target.name;

                const { data } = await axios.put('/usuario', { id, estado });

                if (data) {

                    alert(estado ? 'Skater aprobado' : 'Skates en revisión');

                } else {

                    alert('Ha ocurrido un error. La actualización del estado ha fallado');

                };

            } catch (error) {

                alert(error);

            };

        });

    };

})();

const verificarUsuario = (async () => {

    $('#botonLogin').click(async (e) => {

        e.preventDefault();

        const email = $('#emailLogin').val();
        const pass = $('#passLogin').val();

        const payload = { email, pass };

        try {

            const { data: token } = await axios.post('/verificar', payload);

            if (token) {

                alert('Autenticación exitosa');
                window.location.href = `/cuenta?token=${token}`;

            };

        } catch (error) {

            alert(error);

        };

    });

})();

const actualizarUsuario = (async () => {

    $('#botonActualizar').click(async (e) => {

        e.preventDefault();

        try {

            const id = $('#datosId').val();
            const nombre = $('#datosNombre').val();
            const password = $('#datosPassword').val();
            const confirmar = $('#datosConfirm').val();
            const experiencia = $('#datosAnios').val();
            const especialidad = $('#datosEspecialidad').val();

            const payload = { id, nombre, password, confirmar, experiencia, especialidad };

            if (password == confirmar) {

                const { data } = await axios.put('/cuenta', payload);

                if (data) {

                    alert('Actualización exitosa');
                    window.location.href = '/';

                } else {

                    alert('La actualización ha fallado');

                };

            } else {

                alert('Las contraseñas no coinciden');

            };

        } catch (error) {

            alert(error);

        };

    });

})();

const eliminarUsuario = (async () => {

    $('#botonBorrar').click(async (e) => {

        e.preventDefault();

        try {

            const id = $('#datosId').val();
            const foto = $('#datosFoto').val();

            const { data } = await axios.delete(`/cuenta?id=${id}&foto=${foto}`);

            if (data) {

                alert('La cuenta se ha borrado');
                window.location.href = '/';

            } else {

                alert('Ha ocurrido un error. No se pudo borrar la cuenta');

            };

        } catch (error) {

            alert(error);

        };

    });

})();