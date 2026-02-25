# Sistema-de-lavanderia
Sistema para una lavanderia donde se almacenaran datos referentes al sistema validos

# How to start?
First we need to create and activate and a virtual environment

```bash
# create environment
python3 -m venv venv

# Too
py -m venv venv

# Activate the environment'

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# After all we install the dependencies
pip install -r requirements.txt
```

Once we have all the depentencies, we start running our proyect with the uvicorn dependencie

```bash
uvicorn main:app --reload
```
