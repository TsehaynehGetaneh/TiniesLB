from django import forms
import webcolors
from .models import Color

class ColorFieldWithName(forms.ModelForm):
    search_color = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'Enter color name...'}),
        label='Add Color by Name'
    )

    class Meta:
        model = Color
        fields = ['color', 'search_color']

    def clean(self):
        cleaned_data = super().clean()
        color_name = cleaned_data.get('search_color')

        if color_name:
            try:
                # Convert the color name to a hex code
                hex_code = webcolors.name_to_hex(color_name.lower())
                # Update the color field with the hex code
                cleaned_data['color'] = hex_code
            except ValueError:
                raise forms.ValidationError('Invalid color name')

        return cleaned_data
