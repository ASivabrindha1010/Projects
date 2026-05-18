from flask import *
import pandas as pd
import logging
import joblib


# url='http://127.0.0.1:5000'

app = Flask(__name__)
logging.basicConfig(filename='app.log', level=logging.INFO)
loaded_model = joblib.load('knn_model_new.pkl')
course_labels = {'Computer': 0, 'Maths': 1, 'Physics': 2, 'Chemistry': 3, 'Biology': 4,'Commerce':5,'Economic':6}

@app.route('/')
def homepage():
    app.logger.info('Home route accessed')
    return render_template('home_page.html')

@app.route("/sign_in_details", methods=['POST', 'GET'])
def sign_in():
    app.logger.info('sign_in_details accessed')
    return render_template('sign_in.html')


@app.route("/log_in_details", methods=['POST', 'GET'])
def log_in():
    app.logger.info('log_in_details accessed')
    return render_template('log_in.html')


@app.route("/sign_in_parameters", methods=['POST', 'GET'])
def sign_in_parameters():
    
    output_dictionary={}
    
    if request.method == 'POST':
        
        first_name = request.form.get('firstname')
        last_name = request.form.get('lastname')
        mobile_number = request.form.get('mobilenumber')
        email = request.form.get('email')
        psw = request.form.get('psw')
        psw_repeat = request.form.get('psw-repeat')
        
        output_dictionary['first_name']=first_name
        output_dictionary['last_name']=last_name
        output_dictionary['mobile_number']=mobile_number
        output_dictionary['email']=email
        output_dictionary['psw']=psw
        output_dictionary['psw_repeat']=psw_repeat
        output_dictionary['main_balance']=1000

        df=pd.DataFrame(output_dictionary, index=[0])
        df.to_csv('sign_details.csv',index=True)

        return render_template('home_page.html')


@app.route("/log_in_parameters", methods=['POST', 'GET'])
def log_in_parameters():
    if request.method == 'POST':
        mobile_number=request.form.get('mobilenumber')
        psw=str(request.form.get('psw'))

        df=pd.read_csv('sign_details.csv')
        sign_password=str(df['psw'][0])

        if psw==sign_password:
            return render_template('new_mark_sheet.html')
        else:
            return redirect(url_for('log_in'))  



@app.route("/student_mark", methods=['POST', 'GET'])
def student_mark():
    if request.method == 'POST':
        Maths=int(request.form.get('maths'))
        Physics=int(request.form.get('physics'))
        Chemistry=int(request.form.get('chemistry'))
        Biology=int(request.form.get('Biology'))
        Computer_Science=int(request.form.get('Computer_Science'))
        Commerce=int(request.form.get('Commerce'))
        Economic=int(request.form.get('Economic'))

        new_marks = {'Maths': Maths, 'Physics': Physics, 'Chemistry': Chemistry, 'biology': Biology,'Computer':Computer_Science,'Commerce':Commerce,'Economic':Economic}
        print('--------new_marks---------')
        print(new_marks)
        print('--------------------------')
        new_data = pd.DataFrame([new_marks])
        prediction = loaded_model.predict(new_data)
        print(prediction)
        course_name=list(course_labels.keys())[prediction[0]]
        return render_template('profile.html',Maths=Maths,Physics=Physics,Chemistry=Chemistry,Biology=Biology,Computer_Science=Computer_Science,course_name=course_name,Commerce=Commerce,Economic=Economic)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000,debug=True)


