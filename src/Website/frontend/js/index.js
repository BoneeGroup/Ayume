const button = document.querySelector('.navbar__buttons-front a')

function onButtonChange() {
    if(location.hash === '#/commands') {
        button.textContent = 'Pagina Inicial'
        button.setAttribute('href', '#/')
    } else {
        button.textContent = 'Comandos'
        button.setAttribute('href', '#/commands')
    }
}

onButtonChange()
addEventListener('hashchange', onButtonChange)

const router = new VueRouter({
    routes: [
        {path: '/', component: httpVueLoader('../pages/home.vue')},
        {path: '/commands', component: httpVueLoader('../pages/commands.vue')}
    ]
})

const app = new Vue({
    router
})
    .$mount('#app')
