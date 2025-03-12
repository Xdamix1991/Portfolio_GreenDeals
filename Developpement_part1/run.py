from app import create_app
from flask import render_template

app = create_app()

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/mypage')
def mypage():
    return render_template('mypage.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/deal/<deal_id>')
def deal(deal_id):
    return render_template('deal.html', deal_id=deal_id)

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(port=5001, debug=True)
