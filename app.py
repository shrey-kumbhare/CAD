from flask import Flask, render_template,request,session
from flask_sqlalchemy import SQLAlchemy

local_server = True
app = Flask(__name__)
app.secret_key = 'super-secret-key'


app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root:@localhost/cad"
db = SQLAlchemy(app)


class Patient(db.Model):
    sno = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(20), nullable=False)
    password=db.Column(db.String(20), nullable=False)

class Proffeshional(db.Model):
    sno = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(20), nullable=False)
    password=db.Column(db.String(20), nullable=False)

@app.route("/")
def home():
      return render_template('home.html')


@app.route("/login", methods = ['GET', 'POST'])
def login():
    if request.method=='POST':
        username = request.form.get('username')
        userpass = request.form.get('password')
        service = db.session.query(Proffeshional).filter(Proffeshional.email == username  and Proffeshional.password == userpass).first()
        if service:
            return render_template('home.html')
    return render_template('login.html')

@app.route("/register", methods = ['GET', 'POST'])
def register():
    if request.method=='POST':
        username = request.form.get('username')
        userpass = request.form.get('password')
        entry=Proffeshional(email=username,password=userpass)
        db.session.add(entry)
        db.session.commit()
        return render_template('home.html')
    return render_template('register.html')



@app.route("/PATIENTlogin", methods = ['GET', 'POST'])
def Patientlogin():
    if request.method=='POST':
        username = request.form.get('username')
        userpass = request.form.get('password')
        service = db.session.query(Patient).filter(Patient.email == username  and Patient.password == userpass).first()
        if service:
            return render_template('home.html')
    return render_template('patientlogin.html')

@app.route("/PATIENTregister", methods = ['GET', 'POST'])
def Patientregister():
    if request.method=='POST':
        username = request.form.get('username')
        userpass = request.form.get('password')
        entry=Patient(email=username,password=userpass)
        db.session.add(entry)
        db.session.commit()
        return render_template('home.html')
    return render_template('patientregister.html')

app.run(debug=True)