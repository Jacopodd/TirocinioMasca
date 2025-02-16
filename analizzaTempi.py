# Apri il file in modalità lettura
nome_file = 'result3.txt'  # Sostituisci 'miofile.txt' con il nome reale del tuo file
with open(nome_file, 'r') as file:
    # Inizializza una lista per contenere i numeri
    numeri = []
    
    # Leggi ogni riga del file
    for riga in file:
        # Converte il contenuto della riga in un numero (considerando che ogni riga contiene solo un numero)
        numero = float(riga.strip())  # Usa float se i numeri possono avere decimali, altrimenti int
        
        # Aggiungi il numero alla lista
        numeri.append(numero)
        

valore_minimo = min(numeri)
print(f"Il valore minimo nel file '{nome_file}' è: {valore_minimo}")

valore_massimo = max(numeri)
print(f"Il valore massimo nel file '{nome_file}' è: {valore_massimo}")

media = sum(numeri) / len(numeri)
print(f"La media dei numeri nel file '{nome_file}' è: {media}")