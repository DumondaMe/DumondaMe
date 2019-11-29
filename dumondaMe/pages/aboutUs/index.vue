<template>
    <div id="ely-about-us">
        <h2>{{$t('pages:aboutUs.title')}}</h2>
        <div v-if="selectedLanguage === 'de'">
            <p class="top-text">Mit viel fachlichem Know-how und Enthusiasmus entwickeln wir eine moderne
                Internetplattform welche die kollektive Intelligenz nutzt, um die sozialen und ökologischen
                Herausforderungen unserer Zeit anzugehen. Unsere Organisationsform ist die Soziokratie. Der
                gemeinnützige
                Verein DumondaMe ist das tragende Gefäss unseres Wirkens. Die Statuten des Vereins findest du <a
                        target="_blank" :href="bylaws">hier.</a>
            </p>
            <div class="team-sub-title">Das Projektteam</div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoger"/>
                </div>
                <div>
                    <h3 class="name">Roger Waldvogel</h3>
                    <div class="ely-function">Initiator von DumondaMe, Softwareentwicklung</div>
                    <div class="email-address"><a
                            href="mailto:rwaldvogel@dumonda.me">rwaldvogel@dumonda.me</a></div>
                    <p class="about-text">Als eidgenössisch diplomierter Informatikingenieur FH verfüge ich
                        über mehrjährige, professionelle Berufserfahrung in der Entwicklung von komplexen
                        Software Systemen. Es ist für mich eine Herzensangelegenheit, dass die neuen
                        Technologien zum Wohle der Allgemeinheit eingesetzt werden. Diese Zielsetzung war
                        für mich die Hauptmotivation, um das Projekt DumondaMe ins Leben zu rufen.
                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageJeannine"/>
                </div>
                <div>
                    <h3 class="name">Jeannine Brutschin</h3>
                    <div class="ely-function"></div>
                    <div class="email-address without-function"><a
                            href="mailto:jeannine@dumonda.me">jeannine@dumonda.me</a></div>
                    <p class="about-text">Mit momo&ronja möchte ich zeigen, wie wir unser volles Potenzial leben und in
                        Verbundenheit wirksam sein können. Wir alle können einen Beitrag zu einer leuchtenden Zukunft
                        leisten, einfach indem wir uns trauen, wichtige Fragen zu stellen. Was inspiriert dich? Wie kann
                        es gehen? Wer hilft mit? DumondaMe unterstützt uns darin, gemeinsam Antworten zu finden.
                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoman"/>
                </div>
                <div>
                    <h3 class="name">Roman Kümin</h3>
                    <div class="ely-function">Konzept und Software Testing</div>
                    <div class="email-address"><a
                            href="mailto:roman.kuemin@dumonda.me">roman.kuemin@dumonda.me</a></div>
                    <p class="about-text">Ich bin eidgenössisch diplomierter Informatiker, welcher über 15 Jahren in
                        der Business-Analyse eines der grössten Rückversicherers der Welt tätig war. Von dem positiven
                        Potenzial der Gesellschaft bin ich überzeugt und möchte dessen Entfaltung
                        mit der Unterstützung von DumondaMe fördern.

                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageKim"/>
                </div>
                <div>
                    <h3 class="name">Kim Jana Degen</h3>
                    <div class="ely-function"></div>
                    <div class="email-address without-function"><a
                            href="mailto:kimjana@dumonda.me">kimjana@dumonda.me</a></div>
                    <p class="about-text">Ich unterstütze mit momo&ronja die Verwirklichung von Herzensprojekten wie
                        DumondaMe. Diese Plattform erleichtert das Teilen von Wissen und Erfahrungen für den Aufbau
                        einer zukunftsfähigen Gesellschaft und genau das brauchen wir jetzt. Unser kraftvolles Teamwork
                        mit der Ausrichtung auf die Vision bereitet mir grosse Freude: Gemeinsam ist alles möglich!
                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageNils"/>
                </div>
                <div>
                    <h3 class="name">Nils Solanki</h3>
                    <div class="ely-function"></div>
                    <div class="email-address without-function"><a
                            href="mailto:services@solanki.ch">services@solanki.ch</a></div>
                    <p class="about-text">Auf DumondaMe vernetzen sich Menschen, über alle Gesellschaftsbereiche
                        hinweg, auf der Suche nach schöpferischen Antworten auf die spannendsten und drängendsten Fragen
                        unserer Zeit. Ich unterstütze das Team darin, die Vision gemeinsam zu entfalten und
                        aus den Herzen und Köpfen heraus ein freudvolles (digitales) Erlebnis zu gestalten.
                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageChristina"/>
                </div>
                <div>
                    <h3 class="name">Christina Tschopp</h3>
                    <div class="ely-function"></div>
                    <div class="email-address without-function"><a
                            href="mailto:christina.tschopp@soziokratiezentrum.ch">christina.tschopp@soziokratiezentrum.ch</a>
                    </div>
                    <p class="about-text">Ich bin überzeugt, dass es neben Linkedin, Twitter und Facebook usw. eine
                        Plattform braucht, welche werbefrei ist und nicht von Klickraten lebt. Die Fragen und die
                        Sachlichkeit soll die Community leiten. Ich beobachte auf einigen Plattformen im Moment eine
                        Verwässerung und Überschwemmung von zweckfremden Inhalten durch reine Profilierungsaktivitäten
                        von Personen und Unternehmen, welche durch die Algorithmen der Plattformbetreiber befeuert
                        werden.
                    </p>
                </div>
            </div>
            <div class="team-sub-title">Ehrenamtliche Helfer</div>
            <p>Des Weiteren werden wir von vielen Menschen auf ehrenamtlicher Basis unterstützt. An dieser Stelle vielen
                herzlichen Dank für euer freiwilliges Wirken, ohne welches dieses Projekt nicht realisierbar wäre.
            </p>
        </div>
        <div v-else-if="selectedLanguage === 'en'">
            <p class="top-text">With a lot of professional know-how and enthusiasm we develop a modern internet
                platform, which makes collective intelligence usable for solving social and ecological challenges. Our
                organizational form is sociocracy. The non-profit society DumondaMe is the supporting organization of
                our work. You can find the statutes of the society <a target="_blank" :href="bylaws">here.</a>
            </p>
            <div class="team-sub-title">The project team</div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoger"/>
                </div>
                <div>
                    <h3 class="name">Roger Waldvogel</h3>
                    <div class="ely-function">Initiator of DumondaMe, Software development</div>
                    <div class="email-address"><a
                            href="mailto:rwaldvogel@dumonda.me">rwaldvogel@dumonda.me</a></div>
                    <p class="about-text">I am a IT engineer and have several years of professional experience in the
                        development of complex software systems. It is a matter close to my heart that the new
                        technologies are used for the benefit of the general public. This objective was the main
                        motivation for me to start the project DumondaMe.
                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageJeannine"/>
                </div>
                <div>
                    <h3 class="name">Jeannine Brutschin</h3>
                    <div class="ely-function"></div>
                    <div class="email-address without-function"><a
                            href="mailto:jeannine@dumonda.me">jeannine@dumonda.me</a></div>
                    <p class="about-text">With momo&ronja I would like to show how we can live our full potential and be
                        effective in solidarity. We can all contribute to a bright future simply by daring to ask
                        important questions. What inspires you? How can it work? Who helps? DumondaMe supports us in
                        finding answers together.
                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageRoman"/>
                </div>
                <div>
                    <h3 class="name">Roman Kümin</h3>
                    <div class="ely-function">Concept and Software Testing</div>
                    <div class="email-address"><a
                            href="mailto:roman.kuemin@dumonda.me">roman.kuemin@dumonda.me</a></div>
                    <p class="about-text">I am a certified computer specialist who worked for over 15 years in the
                        business analysis of one of the largest reinsurers in the world. I am convinced of the positive
                        potential of the society and would like to promote its development with the support of
                        DumondaMe.

                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageKim"/>
                </div>
                <div>
                    <h3 class="name">Kim Jana Degen</h3>
                    <div class="ely-function"></div>
                    <div class="email-address without-function"><a
                            href="mailto:kimjana@dumonda.me">kimjana@dumonda.me</a></div>
                    <p class="about-text">With momo&ronja I support the realization of heart projects like DumondaMe.
                        This platform facilitates the sharing of knowledge and experience to build a sustainable society
                        and that is exactly what we need now. Our powerful teamwork with the focus on the vision gives
                        me great pleasure: Together everything is possible!
                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageNils"/>
                </div>
                <div>
                    <h3 class="name">Nils Solanki</h3>
                    <div class="ely-function"></div>
                    <div class="email-address without-function"><a
                            href="mailto:services@solanki.ch">services@solanki.ch</a></div>
                    <p class="about-text">On DumondaMe people network across all areas of society in search of creative
                        answers to the most exciting and urgent questions of our time. With Solanki, I support the team
                        in unfolding the vision together and creating a joyful (digital) experience out of the hearts
                        and minds.
                    </p>
                </div>
            </div>
            <div class="about-user">
                <div>
                    <img class="profile-image" :src="imageChristina"/>
                </div>
                <div>
                    <h3 class="name">Christina Tschopp</h3>
                    <div class="ely-function"></div>
                    <div class="email-address without-function"><a
                            href="mailto:christina.tschopp@soziokratiezentrum.ch">christina.tschopp@soziokratiezentrum.ch</a>
                    </div>
                    <p class="about-text">I'm convinced that besides Linkedin, Twitter and Facebook etc. it needs a
                        platform that is ad-free and doesn't live on click rates. The questions and the objectivity
                        should guide the community. On some platforms I am currently observing a dilution and flooding
                        of unwanted content through pure profiling activities of individuals and companies, which are
                        fired by the algorithms of the platform operators.
                    </p>
                </div>
            </div>
            <div class="team-sub-title">Volunteers</div>
            <p>Furthermore, we are supported by many people on an voluntary basis. Thank you very much for your work,
                without which this project would not be possible.
            </p>
        </div>
        <timeline></timeline>
    </div>
</template>

<script>
    import Timeline from '~/components/aboutUs/Timeline';

    export default {
        async fetch({store}) {
            store.commit('toolbar/SHOW_BACK_BUTTON');
        },
        components: {Timeline},
        computed: {
            selectedLanguage() {
                return this.$store.state.i18n.language
            },
            bylaws() {
                return `${process.env.staticUrl}/pdf/statuten.pdf`
            },
            imageRoger() {
                return `${process.env.staticUrl}/img/about/roger_waldvogel.jpg`
            },
            imageRoman() {
                return `${process.env.staticUrl}/img/about/roman_kuemin.jpg`
            },
            imageKim() {
                return `${process.env.staticUrl}/img/about/kim_degen.jpg`
            },
            imageJeannine() {
                return `${process.env.staticUrl}/img/about/jeannine_brutschin.jpg`
            },
            imageChristina() {
                return `${process.env.staticUrl}/img/about/christina_tschopp.jpg`
            },
            imageNils() {
                return `${process.env.staticUrl}/img/about/nils_solanki.jpg`
            }
        }
    }
</script>

<style lang="scss">
    #ely-about-us {
        padding-top: 18px;
        max-width: 950px;
        margin: 0 auto 24px auto;
        @media screen and (max-width: $xs) {
            margin-top: 18px;
            padding: 0 16px;
        }

        h2 {
            font-size: 32px;
            color: #333;
            margin-bottom: 20px;
            @media screen and (max-width: $xs) {
                font-size: 28px;
                line-height: 34px;
                margin-bottom: 18px;
            }
        }

        h2.subtitle {
            margin-top: 58px;
            margin-bottom: 0;
        }

        .top-text {
            margin-bottom: 40px;
        }

        p {
            font-weight: 300;
            font-size: 16px;
            line-height: 24px;
        }

        .about-user {
            display: flex;
            margin-bottom: 22px;

            .profile-image {
                margin-right: 18px;
                @media screen and (max-width: $xs) {
                    width: 80px;
                    height: 80px;
                }

                img {
                    border-radius: 2px;
                }
            }

            h3 {
                line-height: 18px;
                font-size: 18px;
                color: $primary-color;

            }

            .ely-function {
                margin-top: 4px;
                font-size: 14px;
                color: $primary-text
            }

            .email-address {
                font-size: 14px;
                line-height: 14px;
                height: 14px;
                margin-top: 4px;
                margin-bottom: 8px;

                a {
                    text-decoration: none;
                    color: $primary-text
                }
            }

            .email-address.without-function {
                margin-top: 6px;
            }
        }

        .team-sub-title {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 22px;
        }
    }
</style>