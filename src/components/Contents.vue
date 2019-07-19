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
import SHA256 from 'crypto-js/sha256'
const BigInteger = require('jsbn').BigInteger

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

      loading: false,

      countdownProgress: 100,
      timeoutId: null,

      currentStage: 1,

      currentAnswerList: Object,
      answerSheet: [],

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
          '14599622791422175902241249202299890418675756111319989014941135622456150041068231325016345869065333336960833330078695225750855688879843395520366131536757391468380072771366311955327922858991999733896053042682224587530149429863580541293737252865394407102059579847390429879822407839607627087466696839323089829658831080300422984371166063880419670054509357735381151853786363422807440599780807611633975841985770764492559696598980961567100568083198659692993429511691064187893091261355844350526279092364357171554243999684386899871413075530347465512305712009151112728892663419581856325200437043433225032679201467374028708477468912716433207020863673878120255205348953487276743135814279386468169972454831638113027046548196495342434518775642923627905891768731605021260636635464158401635985188798959214576162793981041364691605025372776404612270725902311146508888807605967224666917418571342292518345262594391567130713756523415566387356442348955433500190501631318692806778174698134452624277371685911764504079145991944919318958399330989794577534276793685434945806428159626100538828326764604732594151183336477680828408579206533944258113285325165392869275883535461881444675369329786644610686006460797844926323714617134611648262108231506594389445259669275352165746967504541613790355174247022383307055624249518150950041407572736775240705484076946389172639886970754851213963477592328419409792448664728926497950942306932987363844650548570707490121835985820113502262854556987668029809895308382358411262374565489440684211955566340895404929189918145654386047605676254478461569095054844265738914661187952037317981650437900194625304848111295374099631962230969065358799141018538844576696270373682372456751437839286708914821492285456165540487597887188875390768498071964071795271380946958698940799747645192296927784083924788865432159784243138611706879054544682119436864081605739818364457306800407633554184561677817639944804499411188544943837945418711647984626498498707029457367665188801098558817640717572086981781434052190294164921672666761175007611221130756112532235926072843780695902417852088264844537187783710136208438769057347677116300613539359790671276156015327691869101989235689816565668804098664448542849509766871512084415730689371762165103735927697838533769571934281291191570512986412025319319602960092527180354464391950397922845309918710175365105812389660825587932410692371031723589179703685538921998249903307889556488563052475836102930707362392848163909172825784427193590038795445896092946',
        e:
          '102550375030271196722084918357727496464700750387754403274721963493638575946894443219909549861747600541664989459079419653056144821796764901764645486393725555073977573528332221201389726457621380749417654879709154691813185248881235440358628505332385693792090515235478020428858860742931009011269816943450502400084321923754972941061422800955204873922620198669797842897553451818181864922134415436161309090271810667096868409903989985544747494626626350613526164142642823867727530132156872473813647420296943040744990944407826025967421458903661017976004494884840774569586882117770607931639832430910070217343559389822420569597267',
        v:
          '27203675953151481830204566040894444364156496406977565741307825202387310514374543278624992602185974311632471851847284114503810793182457030212230735713601737029624972982119852737037600753764852597055014427914356781083842662905774789501390790316394369684180972598774586749369466158329944424611370540136843903697191369577666578033642814502745567539731530847262231110728306773581916019107009547540381466637100270613679071185497893750762170454614839413009669553442932531615650632901128321919574067597021948563128515537843206315420662936023995166725396152548660638148805950060031061281107819863531908522035439652199826612630017587447644122412986752913772381138208436888431045351172828641074201834708909402287358277652109960983872921826190116701324456468658026579439703144641186529470519395566282487033228911038136829106479538450938335809874652322074438888775908506428049616403258440418318772580909260299790242571369211517671795039479574980912249703385894617512574243177218976472241515893037025059313180604382511602702943704528671701132275671715899450674716740635535532583306433430011780168246479559092972151900683079704154441567478776849508438594180798988553132231733514369428921953186417032339697055934742695092589553934796809588035984314'
      },
      // Message: uk
      uk: '39221',
      // Public key
      pubkey: {
        n:
          '995322805979515834558343468842916180759398735836299642552671277553436605924676002587953511055380189928226375717433917124717908984708606305374032958626554958860909453278783458873306469241244675641365366036514899211875662732509935026648241060520219051521771208017390043986553108598550724072453379477936010566711782041018386220545670193867667919597191273018006880114409775884425240030640659562023006561989146492869210993283887178327183532449477268194712946509715791807615817143939380025007100686067465112278249997157932908876612640941502811186133613668119809840083468471542466139288449635577852164455413746094670350703522699726415589809054462751812570094092751723129609967520463224530348385723535638257968207377103810611269636899915323567881579002268612467803894138380778261525446973153523205937247721136041308068326109914765891224601178223715212135637444748792240096445062639720393786910047718144696810078421071820451081219770308784702534795037936119002778734604013518410242339818832165649911205568297863193799237485570149063423545549483448556190702405905404181393026850748272840861267532602816537334579644915357133405263405757166158992252648721136637621788073868968553137689795416175423960523662971891729651267346627791485749869711443',
        a:
          '12087411521712884230548818932215849915230693065039797732079564198974892862597831109952534077668332643422074158482573732210162273511553665928073726857702557181532656284755210457719371511428101155780356008752425295592824942585276622030008447120971014786632830611193537954352443677531942547872959930513777786107406426542695577986048441822499901134217943076792295594037884535736168807745153656459836503075980912522491314057122456046657116758732006466896814708413871176381538974032518089022453265341233558920419342470261993217488003652157418418014185031499816230354904837843025386687622526310803915419536507409000051075609',
        b:
          '2242270542618448865314559768022100722842570567056924045921386527068339890312069016915455607823684996518941546805310979946701951045890940223094847042228045197340068854071808813643399366076303642309446375377852951266210119887535655542203198741044381532149819298438455894694068472282714459161981921663456731501364545269170188180702140156122178514295944916099375760015071778556315387790506727099991721489671311421671663831332164661445554395491222541225826729390422552293214145097480372858790808600875996573542654224130516646000702896367211682871372098287864227008583484451059672114799718269165603918369004881137307238801',
        c:
          '3847486758243159796895515172456640774238377364207114361071125832899764651849170432345428382841393288105544368133028326434962386649917303953066882299219846125243193404409271954822912465878473288879534414288968728918421955499219107182879335153167910469202674005356189048129023288961608631689799460018567408759115342151784370611824231381685407114183926690312525920769115326113770148573926566857407810445120613989443722658330980493935674273031069032149428145389429503396877464994735840952053414199033745730835357940182948896187316765028005120608327244164393836638867641889517970172625781275092570385942804154408782470404',
        g:
          '79694902543738067551569976442969319157658019824384177227697418677955952659774934227050618422966369755344387672958948475697938524471446831922467840437100908707176735894243192411216027732827007061088352261403538026570676397115572002177952579837870853804728089491969851759848647507798224265643108713502271580000225989965230318002488650389878212790775040363567574248704803977378681418421239485699611716709560459011711786402127371191998501459125059706159553864562266401570005849735513443117253160038972164943729421750058017930976637975056919876324187250639458986023466523048333683864079354987625844974359715260665263171705642126352837826511427911122146256409004974013398174475162417012630982051881206119865710800077884329158126259551172451011191286688127719181169155785274421145395273721516526482979092813639555396638286588447369069562536711929150977281360706436723437702802438016012465402942356823014553614221930481531640409796005442620078985607686920544233588362683411619797733875307301960848370977120348813068208389799556865364779562321686205409481124867527508171014542386935301845256634029160723354310753383710435856172469995168262514962659498801439387296050495937425525648384462027253163340768389096813054896052840494598577791933804',
        h:
          '14278136476795606093042578702252138383567207660664827197503882837252436020330007573428221010226768924354544728409096950571644623349974331458917210692824944190393686822298809384473072813435484606643889635889639325577412887697019292795500378574036177872816107205922502330189636993674716615204444170097570787865643325103401147525719449566644178816283391334442312995721152436591738178660454319028328401766191414756526796863716097652667483607007870212638826452652070817603293076068105425120980818601086921188668887170846665970718173330136851886359892816611477820696787791870189922552880276262068517345562669130128349115225'
      }
    }
    localStorage.setItem('seed', JSON.stringify(seed))
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

        // TODO: certify user credentials (in between stages)
        // * Authenticate user
        let credentials = this.genCredentials()
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

            if (resp.data.status === 'accepted') {
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
                })
            } else {
              // TODO: implement auth failed 403 reroute
              // eslint-disable-next-line no-console
              console.log('Authentication failed.')
              this.loading = false
            }
          })
          .catch(err => {
            // TODO: implement auth failed 403 reroute
            // eslint-disable-next-line no-console
            console.log('Auth error: ', err)
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

        // TODO: certify user credentials (final stage)
        // * Authenticate user
        let credentials = this.genCredentials()
        let rnym = credentials['rnym']
        let currentCourseId = this.tasks[this.currentStage - 1].id

        let api = '/api/v1/auth'
        this.$http({
          method: 'post',
          url: api,
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

            if (resp.data.status === 'accepted') {
              // * Submit results
              this.submitAnswers(rnym)
                .then(() => {
                  this.tasks[this.currentStage - 1].status = 1

                  this.loading = false
                  this.$router.push({ path: '/success' })
                })
                .catch(err => {
                  // TODO: implement submit failed
                  // eslint-disable-next-line no-console
                  console.log('Submit answers failed: ', err)
                  this.loading = false
                })
            } else {
              // TODO: implement auth failed 403 reroute
              // eslint-disable-next-line no-console
              console.log('Authentication failed')
              this.loading = false
            }
          })
          .catch(err => {
            // TODO: implement auth failed 403 reroute
            // eslint-disable-next-line no-console
            console.log('Auth error: ', err)
            this.loading = false
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

      // TODO: POST data to backend
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

    // TODO: implement credential generation
    hash(val) {
      return parseInt(SHA256(String(val)), 16) % 731499577
    },

    genRandom(digit) {
      return Math.floor(Math.random() * Math.pow(2, digit)).toString()
    },

    /**
     * genCredentials()
     * * Generate credentials for backend to authenticate
     */
    genCredentials() {
      let credentials = {}
      // Get seed from localStorage
      if (localStorage.seed) {
        let seed = JSON.parse(localStorage.seed)

        let s = seed.signature.s
        let e = seed.signature.e
        let v = seed.signature.v
        let uk = seed.uk
        let a = seed.pubkey.a
        let b = seed.pubkey.b
        let g = seed.pubkey.g
        let h = seed.pubkey.h
        let n = seed.pubkey.n
        // Private random variables
        let priv = {}
        // Credential parameters
        let params = {}

        // Generate randoms
        let randAttr = ['s', 'e', 'w', 'z', 'x']
        randAttr.forEach(i => {
          priv['r' + i] = this.genRandom(32)
        })
        for (let i = 0; i < 20; i++) {
          priv['r' + i.toString()] = this.genRandom(32)
        }

        priv['w'] = this.genRandom(32)
        priv['r'] = this.genRandom(32)
        priv['r_'] = new BigInteger(priv['rz']).subtract(
          new BigInteger(e).multiply(new BigInteger(priv['rw']))
        )
        // eslint-disable-next-line no-console
        console.log(priv)

        // Calculate C sets
        let grnym = new BigInteger(
          this.hash(this.tasks[this.currentStage - 1].id).toString()
        ).modPow(
          new BigInteger(this.rynmParams.exp),
          new BigInteger(this.rynmParams.gamma)
        )

        params['Cs'] = new BigInteger(g)
          .modPow(new BigInteger(s), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['rs']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['Ce'] = new BigInteger(g)
          .modPow(new BigInteger(e), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['re']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['Cv'] = new BigInteger(v)
          .multiply(
            new BigInteger(g).modPow(
              new BigInteger(priv['w']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['Cw'] = new BigInteger(g)
          .modPow(new BigInteger(priv['w']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['rw']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        priv['z'] = new BigInteger(e).multiply(new BigInteger(priv['w']))
        params['C'] = params['Cv']
          .modPow(new BigInteger(e), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['Cx'] = new BigInteger(g)
          .modPow(new BigInteger(uk), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['rx']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['Cz'] = new BigInteger(g)
          .modPow(new BigInteger(priv['z']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['rz']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))

        // Calculate Y sets
        params['y1'] = params['Cv']
          .modPow(new BigInteger(priv['r1']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r2']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y2'] = new BigInteger(g)
          .modPow(new BigInteger(priv['r1']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r3']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y3'] = new BigInteger(a)
          .modPow(new BigInteger(priv['r4']), new BigInteger(n))
          .multiply(
            new BigInteger(b).modPow(
              new BigInteger(priv['r5']),
              new BigInteger(n)
            )
          )
          .multiply(
            new BigInteger(g).modPow(
              new BigInteger(priv['r6']),
              new BigInteger(n)
            )
          )
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r7']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y4'] = new BigInteger(g)
          .modPow(new BigInteger(priv['r4']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r8']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y5'] = new BigInteger(g)
          .modPow(new BigInteger(priv['r5']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r9']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y6'] = new BigInteger(g)
          .modPow(new BigInteger(priv['r10']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r11']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y7'] = new BigInteger(g)
          .modPow(new BigInteger(priv['r6']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r12']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y8'] = params['Cv']
          .modPow(new BigInteger(priv['r10']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r7']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y9'] = new BigInteger(g)
          .modPow(new BigInteger(priv['r13']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r14']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y10'] = new BigInteger(g)
          .modPow(new BigInteger(priv['r15']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r16']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y11'] = new BigInteger(g)
          .modPow(new BigInteger(priv['r17']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r18']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y12'] = params['Cw']
          .modPow(new BigInteger(priv['r17']), new BigInteger(n))
          .multiply(
            new BigInteger(h).modPow(
              new BigInteger(priv['r19']),
              new BigInteger(n)
            )
          )
          .mod(new BigInteger(n))
        params['y13'] = grnym.modPow(
          new BigInteger(priv['r4']),
          new BigInteger(n)
        )

        // Calculate x sets
        params['x'] = this.hash(
          new BigInteger(g)
            .multiply(new BigInteger(h))
            .multiply(params['C'])
            .multiply(params['Cv'])
            .multiply(params['Cs'])
            .multiply(params['Ce'])
            .multiply(params['Cx'])
            .multiply(params['Cz'])
            .multiply(params['Cw'])
            .toString()
        )

        // Calculate z sets
        let i = 0
        let arr = [
          e,
          priv['r'],
          priv['re'],
          uk,
          s,
          priv['z'],
          priv['r'],
          priv['rx'],
          priv['rs'],
          e,
          priv['re'],
          priv['rz'],
          priv['z'],
          priv['rz'],
          priv['w'],
          priv['rw'],
          e,
          priv['re'],
          priv['r_']
        ]
        arr.forEach(j => {
          i = i + 1
          params['z' + i.toString()] = new BigInteger(
            priv['r' + i.toString()].toString()
          ).add(
            new BigInteger(params['x'].toString()).multiply(
              new BigInteger(j.toString())
            )
          )
        })

        // Calculate rnym
        params['rnym'] = grnym.modPow(
          new BigInteger(uk),
          new BigInteger(this.rynmParams.gamma)
        )

        for (let key in params) {
          credentials[key] = params[key].toString()
        }
        // eslint-disable-next-line no-console
        console.log(credentials)
      } else {
        // localStorage doesn't have seed elements
        // TODO: 404
      }
      return credentials
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
