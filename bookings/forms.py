from django import forms
from .models import LicenseQuote


class LicenseQuoteForm(forms.ModelForm):
    class Meta:
        model = LicenseQuote
        fields = ['media', 'message']

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super().__init__(*args, **kwargs)
        self.fields['media'].queryset = user.favourites.all()
        self.fields['media'].label = 'Select the media you would like to license'
        self.fields['message'].label = 'Please provide a brief description of your intended use'
        self.fields['message'].widget.attrs.update({'rows': 4})
        self.fields['message'].help_text = 'Please provide as much detail as possible'
        # to instantiate it in the view:
        # form = LicenseQuoteForm(request.POST or None, user=request.user)
