<template>
    <section class="commands-page">
        <div class="table-content">
            <table class="table">
                <caption class="table__caption">Comandos da Ayume</caption>
                <tr class="table__table-header-row">
                    <th id="category">Categoria:  </th>
                    <th id="name">Nome:  </th>
                    <th id="aliases">Aliases:  </th>
                    <th id="description">Descrição: </th>
                </tr>
                <tr class="table__data-row" v-for="{category, name, aliases, description} in commands" :key="name">
                    <td class="category_data">{{category}}</td>
                    <td class="name_data">{{name}}</td>
                    <td class="aliases_data">{{aliases | aliasesToTable}}</td>
                    <td class="description_data">{{description.pt}}</td>
                </tr>
            </table>
        </div>
    </section>
</template>

<script>
module.exports = {
    data() {
        return {
            commands: []
        }
    },
    filters: {
        aliasesToTable(aliasesArray) {
            if(!aliasesArray || aliasesArray.length == 0)
            return 'Sem alcunhas.'

            return aliasesArray.reduce((prev, curr) => prev + ', ' + curr)
        }
    },
    async created() {
        //precisa json no formato {category, name, aliases[], description}

        const response = await fetch('/api/commands', {
            method: 'GET'
        })

        if (response.status >= 400)
            return console.log(`${response.status}: {${response.statusText}}`)

        this.commands = await response.json()
    }
}
</script>

<style scoped>
.commands-page {
    display: flex;
    justify-content: center;
    padding-top: 4rem;
    margin-bottom: 7rem;
}


.table-content {
    box-shadow: 10px 10px 9px 0px rgba(0,0,0,0.34);
}

.table {
    --border: solid 1px lightgray;
    --radius: 5px;
    border: var(--border);
    font-size: 2rem;
    font-family: var(--roboto-font);
    width: 60vw;
    line-height: 2.6rem;
    background: white;
}

    .table td, th {
        padding: 0.5rem 3rem;
    }



.table__caption {
    border-top: var(--border);
    border-right: var(--border);
    border-left: var(--border);

    border-top-left-radius: var(--radius);
    border-top-right-radius: var(--radius);
    padding: 1rem 0;
}

.table__table-header-row th {
    text-align: initial;
}

.table__data-row {
    font-weight: 100;
}


@media (max-width: 1000px) {
    .commands-page {
        display: initial !important;
        justify-content: initial !important;
        padding-top: initial !important;
        /* padding-bottom: initial !important; */
    }

    .table-content {
        box-shadow: initial !important;
    }

    .table {
        width: 100vw !important;
    }

    .table__caption {
        border-top-left-radius: initial !important;
        border-top-right-radius: initial !important;
    }
}

@media (max-width: 831px) {
    .table td, th {
        padding: 0.5rem .3rem !important;
    }
}


@media (max-width: 611px) {
    .table {
        font-size: 1rem !important;
        line-height: initial !important;
    }

    .table__caption {
        padding: initial !important;
        font-size: 1.3rem;
    }
}

@media (max-width: 324px) {
    .table td, th {
        padding: initial !important;
    }
}

@media (max-width: 309px) {
    .table {
        font-size: .9rem !important;
    }
}

</style>