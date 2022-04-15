const $title = document.querySelector('.crud-title');
const $form = document.querySelector('.crud-form');
const $table = document.querySelector('.table-data');
const $template = document.querySelector('#template-table').content;
const $fragment = document.createDocumentFragment();

const getAllData = async () => {
    try {
        let res = await axios.get('http://localhost:3000/midfielders');
        let data = await res.data;
        data.forEach(el => {
            $template.querySelector('.id').textContent = el.id;
            $template.querySelector('.name').textContent = el.name;
            $template.querySelector('.country').textContent = el.country;
            $template.querySelector('.dorsal').textContent = el.dorsal;
            $template.querySelector('.btnEdit').dataset.id = el.id;
            $template.querySelector('.btnEdit').dataset.name = el.name;
            $template.querySelector('.btnEdit').dataset.country = el.country;
            $template.querySelector('.btnEdit').dataset.dorsal = el.dorsal;
            $template.querySelector('.btnDelete').dataset.id = el.id;
            let $clone = document.importNode($template, true);
            $fragment.appendChild($clone);
        })
        $table.querySelector('tbody').appendChild($fragment);
    } catch (err) {
        let message = err.response.statusText || 'Data not found';
        let notify = `<div class="alert alert-danger" role="alert">Error ${err.response.status}: ${message}</div>`;
        $table.insertAdjacentHTML('afterend', notify);
    }   
}

document.addEventListener('DOMContentLoaded', getAllData);

document.addEventListener('submit', async (e) => {
    if(e.target === $form){
        e.preventDefault();
        if(!e.target.id.value){
            /* ---> CREATE <--- */
            try {
                let res = await axios('http://localhost:3000/midfielders', {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    data: JSON.stringify({
                        name: e.target.name.value,
                        country: e.target.country.value,
                        dorsal: e.target.dorsal.value
                    })
                })
                let data = await res.data;
                location.reload();
            } catch (err) {
                let message = err.response.statusText || 'Data not found';
                let notify = `<div class="alert alert-danger" role="alert">Error ${err.response.status}: ${message}</div>`;
                $table.insertAdjacentHTML('afterend', notify);
            }
        } else {
            /* ---> UPDATE <---- */
            try {
                let res = await axios(`http://localhost:3000/midfielders/${e.target.id.value}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    data: JSON.stringify({
                        name: e.target.name.value,
                        country: e.target.country.value,
                        dorsal: e.target.dorsal.value
                    })
                })
                let data = await res.data;
                location.reload();
            } catch (err) {
                let message = err.response.statusText || 'Data not found';
                let notify = `<div class="alert alert-danger" role="alert">Error ${err.response.status}: ${message}</div>`;
                $table.insertAdjacentHTML('afterend', notify);
            }
        }
    }
})

document.addEventListener('click', async (e) => {
    if(e.target.matches('.btnEdit')){
        $title.textContent = 'Actualizar Datos';
        $form.name.value = e.target.dataset.name;
        $form.country.value = e.target.dataset.country;
        $form.dorsal.value = e.target.dataset.dorsal;
        $form.id.value = e.target.dataset.id;
    }
    if(e.target.matches('.btnDelete')){
        let conf = confirm('¿Esta seguro que desea eliminar el registro?');
        if (conf){
            try {
                let res = await axios(`http://localhost:3000/midfielders/${e.target.dataset.id}`, {
                    method: 'DELETE'
                })
                let data = await res.data;
                location.reload();
            } catch (err) {
                let message = err.response.statusText || 'Data not found';
                let notify = `<div class="alert alert-danger" role="alert">Error ${err.response.status}: ${message}</div>`;
                $table.insertAdjacentHTML('afterend', notify);
            }
        }
    }
})