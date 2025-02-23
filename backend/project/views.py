from django.http import JsonResponse
import csv
import os
from rest_framework.decorators import api_view

@api_view(['GET'])
def get_dream_dictionary(request):
    try:
        # Get the absolute path to dream_dict.csv
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        file_path = os.path.join(base_dir, 'dream_dict.csv')
        
        print(f"Looking for file at: {file_path}")
        print(f"File exists: {os.path.exists(file_path)}")
        
        dream_dict = []
        with open(file_path, 'r', encoding='utf-8') as file:
            # Skip header if it exists
            next(file, None)
            
            # Read CSV file
            csv_reader = csv.reader(file)
            for row in csv_reader:
                if len(row) >= 2:
                    symbol = row[0].strip()
                    interpretation = row[1].strip()
                    if symbol:
                        dream_dict.append({
                            'symbol': symbol,
                            'interpretation': interpretation
                        })
        
        print(f"Processed {len(dream_dict)} dream symbols")
        return JsonResponse(dream_dict, safe=False)
    except Exception as e:
        print(f"Error reading dream dictionary: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500) 