const cfg=window.ATHENA_CONFIG||{}; const sb=(cfg.supabaseUrl&&cfg.supabaseKey)?supabase.createClient(cfg.supabaseUrl,cfg.supabaseKey):null;
let user=null, selectedMood='🌷', chatHistory=[], timerSeconds=900,timerInterval=null, game={};

const $=id=>document.getElementById(id);
const today=new Date().toLocaleDateString('en-CA');

let calendarDate = new Date();
let selectedAgendaDate = today;
let monthTasks = [];
function dateLabel(d){return new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'})}
function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    $('calendarMonth').textContent = calendarDate.toLocaleDateString(
        'pt-BR',
        { month: 'long', year: 'numeric' }
    );

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const previousMonthDays = new Date(year, month, 0).getDate();

    const grid = $('calendarGrid');

    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    let html = weekdays.map(day =>
        `<div class="calendar-weekday">${day}</div>`
    ).join('');

    for (let i = 0; i < 42; i++) {
        let day, date, otherMonth = false;

        if (i < firstDay) {
            day = previousMonthDays - firstDay + i + 1;
            date = new Date(year, month - 1, day);
            otherMonth = true;
        } else if (i >= firstDay + daysInMonth) {
            day = i - firstDay - daysInMonth + 1;
            date = new Date(year, month + 1, day);
            otherMonth = true;
        } else {
            day = i - firstDay + 1;
            date = new Date(year, month, day);
        }

        const dateString = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0')
        ].join('-');

        const hasTasks = monthTasks.some(t => t.task_date === dateString);
        const isToday = dateString === today;
        const isSelected = dateString === selectedAgendaDate;

        html += `
            <button class="calendar-day
                ${otherMonth ? 'other-month' : ''}
                ${hasTasks ? 'has-tasks' : ''}
                ${isToday ? 'today' : ''}
                ${isSelected ? 'selected' : ''}"
                data-calendar-date="${dateString}">
                <span class="calendar-day-number">${day}</span>
                ${hasTasks ? '<span class="calendar-task-dot"></span>' : ''}
            </button>
        `;
    }

    grid.innerHTML = html;
}

function renderSelectedDay() {
    const tasks = monthTasks.filter(
        task => task.task_date === selectedAgendaDate
    );

    $('selectedDayLabel').textContent =
        dateLabel(selectedAgendaDate);

    $('agendaTasks').innerHTML = tasks.length
        ? tasks.map(taskHTML).join('')
        : '<div class="empty">Sua agenda está leve por aqui. Quer adicionar algo? 🌷</div>';
}
function showView(v){document.querySelectorAll('.view').forEach(x=>x.classList.add('hidden'));$('view-'+v).classList.remove('hidden');document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.view===v));if(v==='agenda')loadTasks();if(v==='diary')loadDiary()}
function msg(el,t){el.textContent=t}
async function auth(){if(!sb){msg($('authMsg'),'Configure SUPABASE_URL e SUPABASE_ANON_KEY no .env para ativar as contas.');return}const email=$('email').value.trim(),password=$('password').value;msg($('authMsg'),'Só um instante…');let r=await sb.auth.signInWithPassword({email,password});if(r.error){r=await sb.auth.signUp({email,password});if(r.error){msg($('authMsg'),r.error.message);return}if(!r.data.session){msg($('authMsg'),'Conta criada! Confira seu e-mail para confirmar e depois entre.');return}}user=r.data.user;enter()}
function enter() {
    $('auth').classList.add('hidden');
    $('app').classList.remove('hidden');

    $('todayLabel').textContent = dateLabel(today);
    $('diaryDate').value = today;

    calendarDate = new Date();
    selectedAgendaDate = today;

    loadTasks();
}
async function logout(){await sb?.auth.signOut();user=null;$('app').classList.add('hidden');$('auth').classList.remove('hidden')}
function taskHTML(t){return `<div class="task ${t.completed?'done':''}"><input type="checkbox" ${t.completed?'checked':''} data-check="${t.id}"><span class="task-title">${escapeHTML(t.title)}</span><span class="task-meta">${t.task_time? t.task_time.slice(0,5)+' · ':''}${t.diary_mood||''}</span><button class="text-btn" data-timer="${escapeHTML(t.title)}">⏱</button></div>`}
function escapeHTML(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function loadTasks() {
    if (!sb || !user) return;

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDate = [
        year,
        String(month + 1).padStart(2, '0'),
        '01'
    ].join('-');

    const lastDay = new Date(year, month + 1, 0).getDate();

    const lastDate = [
        year,
        String(month + 1).padStart(2, '0'),
        String(lastDay).padStart(2, '0')
    ].join('-');

    const { data, error } = await sb
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('task_date', firstDate)
        .lte('task_date', lastDate)
        .order('task_date')
        .order('task_time');

    if (error) {
        console.error('Erro ao carregar tarefas:', error);
        return;
    }

    monthTasks = data || [];

    renderCalendar();
    renderSelectedDay();

    const todayTasks = monthTasks.filter(
        task => task.task_date === today
    );

    $('todayTasks').innerHTML = todayTasks.length
        ? todayTasks.map(taskHTML).join('')
        : '<div class="empty">Você não tem tarefas para hoje. 🌷</div>';
}
function openTask(date = selectedAgendaDate, title = '') {
    $('taskModal').classList.remove('hidden');
    $('taskDate').value = date;
    $('taskTitle').value = title;
    $('taskTime').value = '';
    $('taskNotes').value = '';
    $('taskTitle').focus();
}
async function saveTask(e) {
    e.preventDefault();

    if (!sb || !user) return;

    const task = {
        user_id: user.id,
        title: $('taskTitle').value.trim(),
        task_date: $('taskDate').value,
        task_time: $('taskTime').value || null,
        notes: $('taskNotes').value
    };

    const { error } = await sb.from('tasks').insert(task);

    if (error) {
        alert(error.message);
        return;
    }

    $('taskModal').classList.add('hidden');

    selectedAgendaDate = task.task_date;

    const [year, month] = task.task_date.split('-').map(Number);
    calendarDate = new Date(year, month - 1, 1);

    await loadTasks();
}
async function toggleTask(id,checked){await sb.from('tasks').update({completed:checked}).eq('id',id).eq('user_id',user.id);loadTasks()}
function setMood(m){selectedMood=m;document.querySelectorAll('[data-mood]').forEach(b=>b.classList.toggle('selected',b.dataset.mood===m))}
async function saveDiary(e){e.preventDefault();if(!sb||!user)return;const files=[...$('diaryImages').files],urls=[];for(const f of files){const path=`${user.id}/${crypto.randomUUID()}-${f.name.replace(/[^\w.-]/g,'_')}`;const {error}=await sb.storage.from('diary-images').upload(path,f);if(error){alert('Não consegui enviar a imagem: '+error.message);return}const {data}=sb.storage.from('diary-images').getPublicUrl(path);urls.push(data.publicUrl)}const {error}=await sb.from('diary_entries').insert({user_id:user.id,entry_date:$('diaryDate').value,mood:selectedMood,content:$('diaryContent').value,image_urls:urls});if(error){alert(error.message);return}$('diaryContent').value='';$('diaryImages').value='';await loadDiary();alert('Seu registro foi guardado com carinho. 💜')}
async function loadDiary(){if(!sb||!user)return;const {data,error}=await sb.from('diary_entries').select('*').eq('user_id',user.id).order('entry_date',{ascending:false}).limit(30);if(error)return;$('diaryEntries').innerHTML=data.map(e=>`<article class="entry"><div class="entry-head"><b>${e.mood} ${dateLabel(e.entry_date)}</b></div><p>${escapeHTML(e.content)}</p>${(e.image_urls||[]).map(u=>`<img src="${escapeHTML(u)}" alt="Lembrança do diário">`).join('')}</article>`).join('')||'<div class="empty">Seus registros vão aparecer aqui. 🌙</div>'}
function addBubble(text,who){const b=document.createElement('div');b.className='bubble '+who;b.textContent=text;$('chatMessages').appendChild(b);$('chatMessages').scrollTop=$('chatMessages').scrollHeight;return b}
function setTimer(min){timerSeconds=min*60;renderTimer()};function renderTimer(){$('timerDisplay').textContent=String(Math.floor(timerSeconds/60)).padStart(2,'0')+':'+String(timerSeconds%60).padStart(2,'0')}
function startTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null;
    $('timerStart').textContent='Continuar';return} $('timerStart').textContent='Pausar';timerInterval=setInterval(()=>{timerSeconds--;renderTimer();if(timerSeconds<=0){clearInterval(timerInterval);timerInterval=null;$('timerStart').textContent='Começar';alert('Tempo concluído! Você fez o que pôde. 💜');}},1000)}
// Mini-jogo original de pulo com canvas, sem bibliotecas.
function startGame(){const c=$('gameCanvas'),ctx=c.getContext('2d');game={y:130,vy:0,ob:650,score:0,over:false};function frame(){ctx.clearRect(0,0,c.width,c.height);ctx.strokeStyle='#6f557d';ctx.beginPath();ctx.moveTo(0,150);ctx.lineTo(640,150);ctx.stroke();ctx.font='30px serif';ctx.fillText('🦉',35,game.y);ctx.fillText('🌵',game.ob,145);ctx.fillStyle='#d8baff';ctx.font='14px Nunito';ctx.fillText('Pontos: '+game.score,550,25);if(!game.over){game.vy+=.65;game.y+=game.vy;if(game.y>130){game.y=130;game.vy=0}game.ob-=5;if(game.ob< -25){game.ob=650;game.score++}if(game.ob<70&&game.ob>35&&game.y>100){game.over=true;ctx.fillText('Fim de jogo — toque para tentar de novo',170,80)}requestAnimationFrame(frame)}}frame()}
async function sendChat(e) {
    e.preventDefault();

    const text = $('chatText').value.trim();
    if (!text) return;

    $('chatText').value = '';
    addBubble(text, 'user');
    chatHistory.push({role: 'user', content: text});

    const loading = addBubble('Estou pensando com carinho…', 'bot');

    try {
        const r = await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({messages: chatHistory})
        });

        const data = await r.json();
        loading.remove();

        if (!r.ok) throw Error(data.error || 'A IA não respondeu.');

        const reply = data.reply;
        const actionMatch = reply.match(/<ACTION>(\{[\s\S]*?\})<\/ACTION>/);
        const clean = reply.replace(/<ACTION>[\s\S]*?<\/ACTION>/, '').trim();

        addBubble(clean, 'bot');
        chatHistory.push({role: 'assistant', content: reply});

        if (actionMatch) {
            const a = JSON.parse(actionMatch[1]);

            if (a.type === 'create_task' && a.title && a.date && sb && user) {
                const {error} = await sb.from('tasks').insert({
                    user_id: user.id,
                    title: a.title,
                    task_date: a.date,
                    task_time: a.time || null,
                    notes: a.notes || ''
                });

                addBubble(
                    error
                        ? 'Não consegui salvar a tarefa. Vamos tentar pela agenda?'
                        : `Prontinho, “${a.title}” entrou na sua agenda. 🌷`,
                    'bot'
                );

                if (!error) loadTasks();

            } else if (a.type === 'timer' && a.minutes) {
                setTimer(a.minutes);
                $('timerModal').classList.remove('hidden');
            }
        }

    } catch (err) {
        loading.textContent = err.message;
    }
}
function jump(){if(game.over){startGame();return}if(game.y>=130)game.vy=-12}
$('authForm').addEventListener('submit',e=>{e.preventDefault();auth()});$('logout').onclick=logout;document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>showView(b.dataset.view));document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>showView(b.dataset.goto));
$('quickTask').onclick = () => openTask(today);
$('addTask').onclick = () => openTask(selectedAgendaDate);
    $('closeTask').onclick=()=>$('taskModal').classList.add('hidden');$('taskForm').onsubmit=saveTask;
    $('prevMonth').onclick = async () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    selectedAgendaDate = [
        calendarDate.getFullYear(),
        String(calendarDate.getMonth() + 1).padStart(2, '0'),
        '01'
    ].join('-');

    await loadTasks();
};

$('nextMonth').onclick = async () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    selectedAgendaDate = [
        calendarDate.getFullYear(),
        String(calendarDate.getMonth() + 1).padStart(2, '0'),
        '01'
    ].join('-');

    await loadTasks();
};

$('calendarGrid').addEventListener('click', async e => {
    const day = e.target.closest('[data-calendar-date]');

    if (!day) return;

    selectedAgendaDate = day.dataset.calendarDate;

    const [year, month] = selectedAgendaDate.split('-').map(Number);
    calendarDate = new Date(year, month - 1, 1);

    await loadTasks();
});
if(sb)sb.auth.getSession().then(({data})=>{if(data.session){user=data.session.user;enter()}});
$('chatForm').addEventListener('submit', sendChat);
function openTaskTimer(title) {
    $('timerTaskName').textContent = title;
    setTimer(25);
    $('timerModal').classList.remove('hidden');
}
document.addEventListener('click', function(e) {
    const button = e.target.closest('[data-timer]');
    if (!button) return;

    openTaskTimer(button.dataset.timer);
});
// Conexões dos controles do cronômetro
$('timerStart').addEventListener('click', startTimer);

document.querySelectorAll('[data-min]').forEach(button => {
    button.addEventListener('click', () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        setTimer(Number(button.dataset.min));
        $('timerStart').textContent = 'Começar';
    });
});

$('closeTimer').addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    $('timerModal').classList.add('hidden');
    $('timerStart').textContent = 'Começar';
});