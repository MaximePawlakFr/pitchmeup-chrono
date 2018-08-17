# Pitch Me Up - Chrono

* [x] Version 1.0
    * As a user, I can configure time (min:sec)
    * As a user, I can start & stop a chronometer
    * TODO
        * [x] Fix startMinutes / startSeconds

* [x] Version 1.2
    * As a user, I can see the chrono full-screen
    * TODO
        * [x] Fix the http access to remote timestamp

* [x] Version 1.4
    * As a user, I can see a slave chrono synchronized with a master

* [x] Version 1.5
    * As a user, I can setup a master chrono in order to be shared

* [x] Version 1.6
    * As a user, I can connect to a chrono I've just created
    * As a user, when I'm mastering a chrono, I can start this chrono with a new time

* [ ] v 1.7
    * As a user, when I'm mastering a chrono, I can stop this chrono and stop all others watching

* [ ] v 1.8
    * As a user, I cannot setup an existing chrono if the password does not match

* Others
    * [ ] Update favicon
    * [ ] Add head data

---

# Draft

<App>
    <Chrono>
        <Digits/>
        <Controls/>
        <SharedControls>
    <Chrono/>
</App>