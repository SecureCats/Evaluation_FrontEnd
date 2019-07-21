<template>
  <v-layout column>
    <vue-element-loading :active="loading" spinner="bar-fade-scale" color="#3A8FCA" is-full-screen />
    <EvaluationTitle :stage="currentStage" :tasks="tasks" :studentInfo="studentInfo" />

    <EvaluationTasks
      :stage="currentStage"
      :task="tasks[currentStage - 1]"
      v-on:collectAnswers="answerCollector"
      ref="evaluationTasks"
    />

    <v-layout id="nav-buttons">
      <v-spacer />
      <v-btn id="next-item-btn" color="primary" round large depressed @click="nextTaskOnClick">
        <span>下一步</span>
        <v-icon dark right>navigate_next</v-icon>
      </v-btn>
    </v-layout>

    <v-snackbar v-model="showNextTaskSnackbar" top color="primary">
      <v-progress-circular :size="20" v-model="countdownProgress"></v-progress-circular>
      <span id="snackbarInfo">你确定要进行下一项评教吗？</span>
      <v-btn flat @click="nextTaskFinalConfirm">是的</v-btn>
    </v-snackbar>

    <v-snackbar v-model="showUncompletedWarning" top color="error">
      <v-icon dark :size="20">error</v-icon>
      <span id="snackbarInfo">你有未回答的题目，请将全部问题回答完整。</span>
      <v-btn flat @click="closeUncompletedWarning">好的</v-btn>
    </v-snackbar>

    <v-snackbar v-model="showEvaluatedWarning" top color="error">
      <v-icon dark :size="20">error</v-icon>
      <span id="snackbarInfo">本节课程你已评价，将直接进入下一部分评教任务。</span>
      <v-btn flat @click="closeEvaluatedWarning">好的</v-btn>
    </v-snackbar>

    <v-snackbar v-model="showCompletedAllSnackbar" top color="success">
      <v-progress-circular :size="20" v-model="countdownProgress"></v-progress-circular>
      <span id="snackbarInfo">全部评教任务已经完成，确认提交结果？</span>
      <v-btn flat @click="submitTaskFinalConfirm">确认</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import EvaluationTitle from '@/components/EvaluationTitle'
import EvaluationTasks from '@/components/EvaluationTasks'

import Cookies from 'js-cookie'
import worker from 'workerize-loader!./../credentials'

export default {
  name: 'Contents',
  components: {
    EvaluationTitle,
    EvaluationTasks
  },
  props: {
    tasks: Array,
    studentInfo: Object
  },
  data() {
    return {
      showNextTaskSnackbar: false,
      showCompletedAllSnackbar: false,
      showUncompletedWarning: false,
      showEvaluatedWarning: false,

      loading: false,

      countdownProgress: 100,
      timeoutId: null,

      currentStage: 1,

      currentAnswerList: Object,

      rynmParams: {
        gamma:
          '76082481189518171659618347271359316061974334924246135550677426868159186269917',
        g:
          '14324589826880501450566120667645878869223081658493572976099532413757027896194',
        rho:
          '14952013069126470028876872236652170302350646862625615129237430316253689',
        exp: '5088444'
      }
    }
  },
  mounted() {
    // TODO: get signature, uk and public key from localStorage (or AIP)
    let seed = {
      // Signature: (s, e, v)
      signature: {
        s:
          '857993067459553745804246353224584382721325797161161718334406190939079668667969452876644081018023312494619443504116362396576046256400623108148728495942495828581992814867083090945231281378991732264902711487944007037114659411494476013113004855576577546191824930679353399152729014949240545300966339970313391735149198490864234103654625874033427988337916182520688334921084312989468571380348076440436539323876084014613974611483783555765940151941692726439919717312683119547266818426788223900962937776004292522775896634931586984228547719377259627501964975442643607720685794568787925787238314243309077733770022216308659665228076528539297751966123699486287324455698705200433853087524377754601902522581347567250650593878697942535563472502120816572784176313445922549886227375539944230529992748353613132192884860246671020738484964528387419052493038551273625872293092429069740849738075386975622894041198199393424241896253189569331945316618979662484896577595879663925457238908444642542629621412586480097458829103438196847686198015476653501074967894440182799999041436713086752525244755894560185277822856412663616988598397249643354272753366540730775318770551419845784646897703123744145866354339150771432324584804598727830989549369079898689088104728018',
        e:
          '550664647410801623391367686382934022222139425415828434805868067043163979870627263443411693542698133845229657102240602001900841607743586768533260158021270228664701720835466164568902939803950113255793330422865721120833661965824605353384036505366414217731871747752528456104244411089207384877295949615770056790019',
        v:
          '10051213846787287293017695328813131791530180330326925470867894752829093622963654063537461607484063725683306322058363107960729968260373599562936723755076500657223487997376709244171451149430688838312447025033147036725954420860353736972785069152222546267757589148838168842323539133198820715854622677942343672885057002997557425695847231382749202295835305665554812192529995373077077493218101124562572396466918768209726280004189545142708805430234496109127844911025989239211144974579449973848869255635672889360731155822009500542521061937720308377217926845473816313922697636750941937161643073997734011433081606180340701593337'
      },
      // Message: uk
      uk: '1223333',
      // Public key
      pubkey: {
        n:
          '18717509941797749417560764574966600472289762943602848754869198820578124146918657201134197159188275162417414422759238325580689714427937920258764226207518380897665997171405626392300823010177425863144544450613967921140111163060255228808666273360541911904509534623858163772702253225019492377842486072039481359680339605245760904386669926769377678330105187603454518822793678376840008247317968745193123014594107629529824089170879003611241657851003447277900796685694008586440930240219128466592576132379592781137645445374737794913744581193136730986421299115067394849260282602280324554720954433874244897581740344102705954294773',
        a:
          '10742020121563019072973206960325514766915559204496674092334048472015141742915749526448149296672454228311251994473442551239986137597051994941069901411926098868166228154244091068300395126573688240796281581345905937623716965335271054423914081099789495782747818574827710002614462677841298471090511773471646246600899797055996666797113119836120896408219155603622244037047894285739126298865838574698600322763301869433149488380644497194399504994199941378636789605178562220842963940611819003294018518221876946007798023896588041766283916122687480057860231205158454317207229538278300168942410280217607382126927594185557395264576',
        b:
          '1959096525147109907897012904203676157550054228204893093017972645253168649715961291790137603113566638562338139123068553050088179458662077562423727084727325295265788965796590309582561824709011379607524380165010844025148544318482658236720507307452597683507533797367700830021384935037525655691067780141418239242353676851610368845759056403540634419777212640723932625812226481389290176639431015960623005427486136777458084799000913867190759817159349935830298989977857737406352077615343930559244553971751328299489056062895187694780418852773633145386001616378306193500059624762119849144011985126865607476170702540873289122500',
        c:
          '12551879608620534894958840158495498136109896770154550499854918974555239116875194610362269987753023374563830794912291272013765800581052592798454634385388248231583069638529783657966708408345287293949469848464572536491977891184212883855620123105628206196354157550404926584972242938541211908092634589285590809011025377038365235207740647717408836230754503371680014138464860718760074835591122801726791770760771822052482178229962047844555367570434147068037927937913820797916151353127929734058898730165104475413052303572455883090283912716502480412033438545256869234322327509618735859311624261001481039456958824149936558605948',
        g:
          '7004016561711896358056312767582760330186319192194853046572792282705718079170700546599311284656504038200582908109057193958000161675995541716215671778636662090476677556004767578567467602586677836471229722770450250248088861525407306618354321693630478216524486232635401393185194055479760464737092876826309154544546285851172523808683000219853051993561941755105333155048781736486593066241994579255164835244693251716399002318089470557385744064544360148273499396994712998668597395213372435224972983206210938665839167852482397778261816701050794605414493604265868493534758621760921263609683635516943976030893706156045596200656',
        h:
          '7118882113527211428855348100615796718920244418147612729198192315602380571360613276729953891678031765394996236853965144554017093001739858409534017852129661504856716557006187621013028352219711656596632615704340446278303434740259044909298995128781401229439251908133389588222280291583190979363033269723318317332373779587255216761275513908032456302214180003823418167533952412675716328971844109709856992874715286655703184607639440152160556028587624637317867038201485728319493580567946990482273038439187158534057427656518190523368107317478365884232618455823449097342264095738690748746016756881784828485919390990743687096225'
      }
    }
    // TODO: remove this line after AIP can communicate with PES
    localStorage.setItem('seed_pes', JSON.stringify(seed))
  },
  methods: {
    /**
     * setSnackbarCountdown
     * * Count down for snackbar notification, 6 seconds
     */
    setSnackbarCountdown(timeLeft, timeTotal) {
      this.countdownProgress = (timeLeft * 100) / timeTotal
      if (timeLeft > 0) {
        this.timeoutId = setTimeout(() => {
          this.setSnackbarCountdown(timeLeft - 300, timeTotal)
        }, 300) //! Update progress every 0.3 seconds.
      }
    },

    /**
     * answerCollector(answerList)
     * * Collect answers from component `EvaluationTasks.vue`
     * @param answerList
     */
    answerCollector(answerList) {
      this.currentAnswerList = answerList
    },

    /**
     * nextTaskOnClick()
     * * Show snackbar and double confirmation button
     */
    nextTaskOnClick() {
      let totalTasks = this.tasks.length

      if (this.currentStage < totalTasks) {
        this.showNextTaskSnackbar = true
      } else {
        this.showCompletedAllSnackbar = true
      }
      let countdownTime = 6 * 1000 // 6 seconds
      this.setSnackbarCountdown(countdownTime, countdownTime)
    },

    /**
     * nextTaskFinalConfirm()
     * * Final confirmation button, authenticates and proceed to next task
     */
    nextTaskFinalConfirm() {
      this.$refs.evaluationTasks.getAnswers()

      clearTimeout(this.timeoutId)
      this.showNextTaskSnackbar = false

      if (this.currentAnswerList === 'undone') {
        this.showUncompletedWarning = true
      } else {
        // Set loading animations
        this.loading = true

        // * Authenticate user
        this.genCredentials()
          .then(credentials => {
            let rnym = credentials['rnym']
            let currentCourseId = this.tasks[this.currentStage - 1].id

            let csrftoken = Cookies.get('csrftoken')

            let api = '/api/v1/auth'
            this.$http({
              method: 'post',
              url: api,
              headers: {
                'X-CSRFToken': csrftoken
              },
              params: {
                course_no: currentCourseId,
                classno: this.studentInfo.class
              },
              data: {
                credentials: credentials
              }
            })
              .then(resp => {
                if (resp.data.status === 'accept') {
                  // * Submit results
                  this.submitAnswers(rnym)
                    .then(() => {
                      this.tasks[this.currentStage - 1].status = 1
                      this.currentStage = this.currentStage + 1

                      this.loading = false
                      // Back to top
                      this.$vuetify.goTo(0)
                    })
                    .catch(err => {
                      // eslint-disable-next-line no-console
                      console.log('Submit answers failed: ', err)
                      this.loading = false
                      this.$router.push({ path: '/denied' })
                    })
                } else if (resp.data.status === 'evaluated') {
                  this.showEvaluatedWarning = true
                  // Proceed to next stage directly
                  this.tasks[this.currentStage - 1].status = 1
                  this.currentStage = this.currentStage + 1

                  this.loading = false
                  // Back to top
                  this.$vuetify.goTo(0)
                } else {
                  this.loading = false
                  this.$router.push({ path: '/denied' })
                }
              })
              .catch(err => {
                // eslint-disable-next-line no-console
                console.log('Auth error: ', err)
                this.loading = false
                this.$router.push({ path: '/denied' })
              })
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.log('Credential generation failed: ', err)
            this.loading = false
          })
      }
    },

    /**
     * submitTaskFinalConfirm()
     * * Final submit confirmation
     */
    submitTaskFinalConfirm() {
      this.$refs.evaluationTasks.getAnswers()

      clearTimeout(this.timeoutId)
      this.showCompletedAllSnackbar = false

      if (this.currentAnswerList === 'undone') {
        this.showUncompletedWarning = true
      } else {
        this.loading = true

        // * Authenticate user
        this.genCredentials().then(credentials => {
          let rnym = credentials['rnym']
          let currentCourseId = this.tasks[this.currentStage - 1].id
          let csrftoken = Cookies.get('csrftoken')

          let api = '/api/v1/auth'
          this.$http({
            method: 'post',
            url: api,
            headers: {
              'X-CSRFToken': csrftoken
            },
            params: {
              course_no: currentCourseId,
              classno: this.studentInfo.class
            },
            data: {
              credentials: credentials
            }
          })
            .then(resp => {
              // eslint-disable-next-line no-console
              console.log('Auth resp: ', resp.data)

              if (resp.data.status === 'accept') {
                // * Submit results
                this.submitAnswers(rnym)
                  .then(() => {
                    this.tasks[this.currentStage - 1].status = 1

                    this.loading = false
                    this.$router.push({ path: '/success' })
                  })
                  .catch(err => {
                    // eslint-disable-next-line no-console
                    console.log('Submit answers failed: ', err)
                    this.loading = false
                    this.$router.push({ path: '/denied' })
                  })
              } else if (resp.data.status === 'evaluated') {
                this.tasks[this.currentStage - 1].status = 1

                this.loading = false
                this.$router.push({ path: '/success' })
              } else {
                this.loading = false
                this.$router.push({ path: '/denied' })
              }
            })
            .catch(err => {
              // eslint-disable-next-line no-console
              console.log('Auth error: ', err)
              this.loading = false
              this.$router.push({ path: '/denied' })
            })
        })
      }
    },

    /**
     * submitAnswers()
     * * Submit answers to backend
     */
    submitAnswers(rnym) {
      let currentCourseId = this.tasks[this.currentStage - 1].id
      let csrftoken = Cookies.get('csrftoken')

      let api = '/api/v1/result'
      return this.$http({
        method: 'post',
        url: api,
        headers: {
          'X-CSRFToken': csrftoken
        },
        params: {
          course_no: currentCourseId,
          classno: this.studentInfo.class
        },
        data: {
          rnym: rnym,
          result: this.currentAnswerList
        }
      })
    },

    closeUncompletedWarning() {
      this.showUncompletedWarning = false
    },
    closeEvaluatedWarning() {
      this.showEvaluatedWarning = false
    },

    /**
     * genCredentials()
     * * Generate credentials for backend to authenticate
     */
    genCredentials() {
      // Get seed from localStorage
      let seed = localStorage.seed_pes
      let currentCourseId = this.tasks[this.currentStage - 1].id
      let rynmParams = this.rynmParams

      // Launch concurrent web worker threads to implement non-blocking calculations
      let credentialWorker = worker()
      return credentialWorker.generate(seed, currentCourseId, rynmParams)
    }
  }
}
</script>

<style>
#next-item-btn {
  font-weight: 700;
}
#nav-buttons {
  margin-right: 30px;
  margin-bottom: 30px;
}
#snackbarInfo {
  margin-left: 20px;
}
</style>
