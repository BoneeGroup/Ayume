<template>
    <section class="home-page">
        <div class="home-page__centered">
            <div class="home-page__control">
                <h2>Usuarios:</h2>
                <span>{{botData.users}}</span>
            </div>
            <div class="home-page__control">
                <h2>Servidores:</h2>
                <span>{{botData.guilds}}</span>
            </div>
            <div class="home-page__control">
                <h2>Ping:</h2>
                <span>{{botData.ping + 'ms'}}</span>
            </div>
        </div>
    </section>
</template>

<script>
module.exports = {
    data(){
        return {
            botData: {
                guilds: 0,
                users: 0,
                ping: 0
            }
        }
    },
    async created() {
        //precisa de um json no formato {guilds, users, players} (todos number)

        const response = await fetch('/api/stats', {
            method: 'GET'
        })

        if (response.status >= 400)
            return console.log(`${response.status}: {${response.statusText}}`)

        this.botData = await response.json()
    }
}
</script>

<style scoped>
.home-page {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.home-page__centered {
    position: relative;    
}

.home-page__control {
    background-color: var(--main-color);
    width: 13vw;
    height: 13vw;
    text-align: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    border-radius: 50%;
    position: absolute;
    top: -10vw;
    left: -10vw;
    user-select: none;
}

    .home-page__control:first-child {
        left: -18vw;
        top: -3vw;
        z-index: 2;
    }

    .home-page__control:nth-child(2) {
        width: 20vw;
        height: 20vw;
    }

    .home-page__control:last-child {
        left: 5vw;
        top: -3vw;
    }

        .home-page__control h2 {
            font-family: var(--roboto-font);
            font-size: 1.6vw;
            margin-bottom: .7vw;
            font-weight: 900;
            color: var(--secondary-color);
        }

            .home-page__control:nth-child(2) h2 {
                font-size: 2.5vw;
            }


        .home-page__control span {
            color: white;
            font-size: 1.4vw;
            font-family: var(--number-font);
        }

            .home-page__control:nth-child(2) span {
                font-size: 2vw;
            }

@media (max-width: 1100px) and (min-width: 416px) {
    .home-page__control {
        width: 143px !important;
        height: 143px !important;
        top: -110px !important;
        left: -110px !important;
    }

        .home-page__control:first-child {
            left: -200px !important;
            top: -33px !important;
        }

        .home-page__control:nth-child(2) {
            width: 220px !important;
            height: 220px !important;
        }

        .home-page__control:last-child {
            left: 57px !important;
            top: -33px !important;
        }

            .home-page__control h2 {
                font-size: 18px !important;
            }

                .home-page__control:nth-child(2) h2 {
                    font-size: 28px !important;
                }
            
            .home-page__control span {
                font-size: 15px !important;
            }

                .home-page__control:nth-child(2) span {
                    font-size: 22px !important;
                }
}

@media (max-width: 415px) {
    .home-page::before {
        content: '';
        background-image: url('../assets/imgs/minimized_background.jpg');
        background-position: center;
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        filter: blur(3px);
    }

        

    .home-page__centered {
        background-color: rgba(0, 0, 0, 0.6);
        padding: 1rem;
        position: initial !important;
    }

        .home-page__centered::before {
            content: 'Estatisticas da Ayume:';
            font-family: var(--roboto-font);
            color: white;
            font-size: 2rem;
            border-bottom: 1px solid lightgrey;
            display: inline-block;
            width: 100%;
            text-align: center;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
        }

    .home-page__control {
        align-items: flex-end;
        padding: 0 .4rem;
        line-height: 1.6rem;
        justify-content: space-between !important;
        background-color: initial !important;
        width: initial !important;
        height: initial !important;
        text-align: initial !important;
        flex-direction: initial !important;;
        border-radius: initial !important;
        position: initial !important;
        top: initial !important;
        left: initial !important;
        user-select: initial !important;
    }

        .home-page__control:first-child {
            left: initial !important;
            top: initial !important;
            z-index: initial !important;
        }

        .home-page__control:nth-child(2) {
            width: initial !important;
            height: initial !important;
        }

        .home-page__control:last-child {
            left: initial !important;
            top: initial !important;
        }

            .home-page__control h2 {
                font-size: 1.3rem !important;
                margin-bottom: initial !important;
                font-weight: initial !important;
                color: white !important;
                /* font-family: initial !important; */
            }

                .home-page__control:nth-child(2) h2 {
                    font-size: 1.3rem !important;
                }


            .home-page__control span {
                font-size: initial !important;
                /* color: white !important; */
                /* font-family: initial !important; */
            }

                .home-page__control:nth-child(2) span {
                    font-size: initial !important;
                }
}

@media (min-width: 367px) and (max-width: 415px) {
    .home-page__centered {
        border-radius: 5px;
    }
}

</style>